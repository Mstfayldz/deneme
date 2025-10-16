const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DB_FILE = 'database.db';

// Veritabanı bağlantısı oluştur. SQLite, dosya yoksa otomatik olarak oluşturur.
const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        console.error('Veritabanı bağlantı hatası:', err.message);
        return;
    }
    console.log(`${DB_FILE} veritabanına başarıyla bağlanıldı.`);

    // Veritabanının boş olup olmadığını kontrol et ve gerekirse kur.
    initializeDatabase();
});

function initializeDatabase() {
    // Ana tablolardan birinin varlığını kontrol et
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Seferler'", (err, row) => {
        if (err) {
            console.error("Veritabanı kontrol hatası:", err.message);
            return;
        }

        // Eğer 'Seferler' tablosu yoksa, veritabanı boştur ve kurulmalıdır.
        if (!row) {
            console.log("Veritabanı boş, kurulum başlıyor...");
            try {
                const schemaSql = fs.readFileSync('veritabani_sema.sql', 'utf8');
                db.exec(schemaSql, (err) => {
                    if (err) {
                        console.error('Şema oluşturulurken hata:', err.message);
                        return;
                    }
                    console.log('Veritabanı şeması başarıyla oluşturuldu.');

                    const dataSql = fs.readFileSync('ornek_veriler.sql', 'utf8');
                    db.exec(dataSql, (err) => {
                        if (err) {
                            console.error('Örnek veriler eklenirken hata:', err.message);
                        } else {
                            console.log('Örnek veriler başarıyla eklendi.');
                        }
                    });
                });
            } catch (fileErr) {
                console.error("SQL dosyaları okunurken hata:", fileErr.message);
            }
        } else {
            console.log("Veritabanı zaten kurulu.");
        }
    });
}

app.use(cors());

// API Rotaları
app.get('/api/seferler', (req, res) => {
    const { kalkis, varis, tarih } = req.query;

    if (!kalkis || !varis || !tarih) {
        return res.status(400).json({ error: 'Kalkış, varış ve tarih zorunludur.' });
    }

    const sql = `
        SELECT
            s.sefer_id,
            s.kalkis_zamani,
            s.varis_zamani,
            kalkis_ist.istasyon_adi AS kalkis_noktasi,
            varis_ist.istasyon_adi AS varis_noktasi,
            t.model AS tren_modeli
        FROM Seferler s
        JOIN Hatlar h ON s.hat_id = h.hat_id
        JOIN Istasyonlar kalkis_ist ON h.kalkis_istasyon_id = kalkis_ist.istasyon_id
        JOIN Istasyonlar varis_ist ON h.varis_istasyon_id = varis_ist.istasyon_id
        JOIN Trenler t ON s.tren_id = t.tren_id
        WHERE
            kalkis_ist.istasyon_adi = ? AND
            varis_ist.istasyon_adi = ? AND
            DATE(s.kalkis_zamani) = ?
    `;

    db.all(sql, [kalkis, varis, tarih], (err, rows) => {
        if (err) {
            console.error("Sorgu hatası:", err.message);
            res.status(500).json({ error: 'Veritabanı sorgusu sırasında bir hata oluştu.' });
            return;
        }
        res.json(rows);
    });
});

app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Veritabanı bağlantısı kapatıldı.');
        process.exit(0);
    });
});