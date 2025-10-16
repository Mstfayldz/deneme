const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DB_FILE = 'database.db';

// --- Veritabanı Kurulum Fonksiyonu ---
function setupDatabase(callback) {
    console.log("Veritabanı kurulumu başlıyor...");
    const db = new sqlite3.Database(DB_FILE, (err) => {
        if (err) {
            console.error('Veritabanı oluşturma hatası:', err.message);
            return;
        }

        const schemaSql = fs.readFileSync('veritabani_sema.sql', 'utf8');
        db.exec(schemaSql, (err) => {
            if (err) {
                console.error('Şema oluşturulurken hata:', err.message);
            } else {
                console.log('Veritabanı şeması başarıyla oluşturuldu.');
                const dataSql = fs.readFileSync('ornek_veriler.sql', 'utf8');
                db.exec(dataSql, (err) => {
                    if (err) {
                        console.error('Örnek veriler eklenirken hata:', err.message);
                    } else {
                        console.log('Örnek veriler başarıyla eklendi.');
                    }
                    db.close(() => {
                        console.log('Kurulum tamamlandı, veritabanı bağlantısı kapatıldı.');
                        callback(); // Kurulum bitince sunucuyu başlat
                    });
                });
            }
        });
    });
}

// --- Sunucu Başlatma Fonksiyonu ---
function startServer() {
    const db = new sqlite3.Database(DB_FILE, (err) => {
        if (err) {
            console.error('Veritabanı bağlantı hatası:', err.message);
        } else {
            console.log('Veritabanına başarıyla bağlanıldı.');
        }
    });

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
                res.status(500).json({ error: err.message });
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
}

// --- Ana Mantık ---
// Sunucu başlamadan önce veritabanı dosyasının varlığını kontrol et
if (!fs.existsSync(DB_FILE)) {
    console.log('Veritabanı dosyası bulunamadı. Yeni bir veritabanı oluşturuluyor...');
    setupDatabase(startServer); // Kurulumu yap, bitince sunucuyu başlat
} else {
    console.log('Veritabanı dosyası zaten mevcut. Sunucu başlatılıyor...');
    startServer(); // Direkt sunucuyu başlat
}