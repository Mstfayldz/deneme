-- Demiryolu Rezervasyon Sistemi Veritabanı Şeması (SQLite Uyumlu)

-- Kullanıcıların bilgilerini tutan tablo
CREATE TABLE Kullanicilar (
    kullanici_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ad VARCHAR(50) NOT NULL,
    soyad VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    sifre VARCHAR(255) NOT NULL,
    telefon VARCHAR(15)
);

-- Tren istasyonlarının bilgilerini tutan tablo
CREATE TABLE Istasyonlar (
    istasyon_id INTEGER PRIMARY KEY AUTOINCREMENT,
    istasyon_adi VARCHAR(100) NOT NULL,
    sehir VARCHAR(50) NOT NULL
);

-- Trenlerin model ve kod bilgilerini tutan tablo
CREATE TABLE Trenler (
    tren_id INTEGER PRIMARY KEY AUTOINCREMENT,
    tren_kodu VARCHAR(20) NOT NULL UNIQUE,
    model VARCHAR(50)
);

-- Trenlerin güzergahını (kalkış ve varış) tanımlayan tablo
CREATE TABLE Hatlar (
    hat_id INTEGER PRIMARY KEY AUTOINCREMENT,
    kalkis_istasyon_id INT,
    varis_istasyon_id INT,
    FOREIGN KEY (kalkis_istasyon_id) REFERENCES Istasyonlar(istasyon_id),
    FOREIGN KEY (varis_istasyon_id) REFERENCES Istasyonlar(istasyon_id)
);

-- Belirli bir tarihte, belirli bir hatta çalışan seferlerin bilgilerini tutan tablo
CREATE TABLE Seferler (
    sefer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    tren_id INT,
    hat_id INT,
    kalkis_zamani DATETIME NOT NULL,
    varis_zamani DATETIME NOT NULL,
    durum VARCHAR(20),
    FOREIGN KEY (tren_id) REFERENCES Trenler(tren_id),
    FOREIGN KEY (hat_id) REFERENCES Hatlar(hat_id)
);

-- Trenlere ait vagonların bilgilerini tutan tablo
CREATE TABLE Vagonlar (
    vagon_id INTEGER PRIMARY KEY AUTOINCREMENT,
    tren_id INT,
    vagon_sira_no INT NOT NULL,
    vagon_tipi VARCHAR(50),
    koltuk_kapasitesi INT NOT NULL,
    FOREIGN KEY (tren_id) REFERENCES Trenler(tren_id)
);

-- Vagonlar içindeki koltukları tanımlayan tablo
CREATE TABLE Koltuklar (
    koltuk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    vagon_id INT,
    koltuk_numarasi VARCHAR(10) NOT NULL,
    FOREIGN KEY (vagon_id) REFERENCES Vagonlar(vagon_id)
);

-- Kullanıcıların yaptığı rezervasyonların ana bilgilerini tutan tablo
CREATE TABLE Rezervasyonlar (
    rezervasyon_id INTEGER PRIMARY KEY AUTOINCREMENT,
    kullanici_id INT,
    rezervasyon_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
    toplam_ucret NUMERIC NOT NULL,
    FOREIGN KEY (kullanici_id) REFERENCES Kullanicilar(kullanici_id)
);

-- Her bir yolcu için oluşturulan biletlerin detaylarını tutan tablo
CREATE TABLE Biletler (
    bilet_id INTEGER PRIMARY KEY AUTOINCREMENT,
    rezervasyon_id INT,
    sefer_id INT,
    koltuk_id INT,
    yolcu_ad VARCHAR(50) NOT NULL,
    yolcu_soyad VARCHAR(50) NOT NULL,
    pnr_kodu VARCHAR(20) NOT NULL UNIQUE,
    bilet_fiyati NUMERIC NOT NULL,
    FOREIGN KEY (rezervasyon_id) REFERENCES Rezervasyonlar(rezervasyon_id),
    FOREIGN KEY (sefer_id) REFERENCES Seferler(sefer_id),
    FOREIGN KEY (koltuk_id) REFERENCES Koltuklar(koltuk_id),
    UNIQUE (sefer_id, koltuk_id)
);

-- İndeksler
CREATE INDEX idx_sefer_kalkis ON Seferler (kalkis_zamani);
CREATE INDEX idx_hat_kalkis_varis ON Hatlar (kalkis_istasyon_id, varis_istasyon_id);