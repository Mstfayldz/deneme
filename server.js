const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = 'database.db';

// Veritabanı bağlantısını oluştur
const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        console.error('Veritabanı bağlantı hatası:', err.message);
    } else {
        console.log('Veritabanına başarıyla bağlanıldı.');
    }
});

// Statik dosyaları sun (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// API Rotaları
app.get('/api/seferler', (req, res) => {
    const { kalkis, varis } = req.query;

    if (!kalkis || !varis) {
        return res.status(400).json({ error: 'Kalkış ve varış noktaları zorunludur.' });
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
        WHERE kalkis_ist.istasyon_adi = ? AND varis_ist.istasyon_adi = ?
    `;

    db.all(sql, [kalkis, varis], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});

// Uygulama kapatıldığında veritabanı bağlantısını kapat
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Veritabanı bağlantısı kapatıldı.');
        process.exit(0);
    });
});