const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Veritabanı dosyasının adı
const DB_FILE = 'database.db';

// Veritabanı dosyasını sil (her başlangıçta temiz bir kurulum için)
if (fs.existsSync(DB_FILE)) {
    fs.unlinkSync(DB_FILE);
    console.log('Mevcut veritabanı dosyası silindi.');
}

// Yeni bir veritabanı bağlantısı oluştur
const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        console.error('Veritabanı bağlantı hatası:', err.message);
        return;
    }
    console.log(`${DB_FILE} adında yeni bir veritabanına başarıyla bağlanıldı.`);
});

// SQL dosyalarını oku ve çalıştır
const runSqlFile = (filePath) => {
    const sql = fs.readFileSync(filePath, 'utf8');
    db.exec(sql, (err) => {
        if (err) {
            console.error(`Hata oluştu (${filePath}):`, err.message);
        } else {
            console.log(`${filePath} başarıyla çalıştırıldı.`);
        }
    });
};

// Veritabanı şemasını ve örnek verileri yükle
db.serialize(() => {
    console.log('Veritabanı kurulumu başlıyor...');
    runSqlFile('veritabani_sema.sql');
    runSqlFile('ornek_veriler.sql');
});

// Bağlantıyı kapat
db.close((err) => {
    if (err) {
        console.error('Veritabanı bağlantısını kapatırken hata oluştu:', err.message);
    } else {
        console.log('Veritabanı kurulumu tamamlandı ve bağlantı kapatıldı.');
    }
});