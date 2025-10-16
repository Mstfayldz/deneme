-- Demiryolu Rezervasyon Sistemi için Örnek Veriler (SQLite Uyumlu)

-- 1. İstasyonları Ekle
INSERT INTO Istasyonlar (istasyon_adi, sehir) VALUES
('Ankara Garı', 'Ankara'),
('Söğütlüçeşme', 'İstanbul'),
('Eskişehir Garı', 'Eskişehir'),
('Konya Garı', 'Konya'),
('Halkalı', 'İstanbul');

-- 2. Trenleri Ekle
INSERT INTO Trenler (tren_kodu, model) VALUES
('YHT800', 'Siemens Velaro'),
('YHT950', 'CAF High Speed');

-- 3. Hatları (Güzergahları) Ekle
INSERT INTO Hatlar (kalkis_istasyon_id, varis_istasyon_id) VALUES
(1, 2), -- Ankara -> Söğütlüçeşme (İstanbul)
(2, 1), -- Söğütlüçeşme (İstanbul) -> Ankara
(1, 4), -- Ankara -> Konya
(4, 1); -- Konya -> Ankara

-- 4. Vagonları Ekle
INSERT INTO Vagonlar (tren_id, vagon_sira_no, vagon_tipi, koltuk_kapasitesi) VALUES
(1, 1, 'Business', 50),
(1, 2, 'Ekonomi', 60),
(2, 1, 'Ekonomi', 60);

-- 5. Koltukları Ekle (Manuel Olarak Birkaç Tane)
-- Vagon 1 (Business)
INSERT INTO Koltuklar (vagon_id, koltuk_numarasi) VALUES
(1, '1A'), (1, '1B'), (1, '2A'), (1, '2B'), (1, '3A'), (1, '3B'),
(1, '4A'), (1, '4B'), (1, '5A'), (1, '5B');
-- Vagon 2 (Ekonomi)
INSERT INTO Koltuklar (vagon_id, koltuk_numarasi) VALUES
(2, '1A'), (2, '1B'), (2, '1C'), (2, '2A'), (2, '2B'), (2, '2C');

-- 6. Seferleri Ekle (2025 ve 2026 için güncellendi)
INSERT INTO Seferler (tren_id, hat_id, kalkis_zamani, varis_zamani, durum) VALUES
-- 2025 Seferleri
(1, 1, '2025-07-15 08:30:00', '2025-07-15 13:00:00', 'Planlandı'), -- Ankara -> İstanbul. Sefer ID: 1
(1, 1, '2025-07-16 09:00:00', '2025-07-16 13:30:00', 'Planlandı'), -- Ankara -> İstanbul (farklı gün). Sefer ID: 2
(1, 2, '2025-07-15 15:00:00', '2025-07-15 19:30:00', 'Planlandı'), -- İstanbul -> Ankara. Sefer ID: 3
-- 2026 Seferleri
(2, 3, '2026-02-20 10:00:00', '2026-02-20 11:45:00', 'Planlandı'), -- Ankara -> Konya. Sefer ID: 4
(2, 4, '2026-02-20 18:00:00', '2026-02-20 19:45:00', 'Planlandı'); -- Konya -> Ankara. Sefer ID: 5

-- 7. Kullanıcıları Ekle
INSERT INTO Kullanicilar (ad, soyad, email, sifre, telefon) VALUES
('Ayşe', 'Yılmaz', 'ayse.yilmaz@example.com', 'gizli_sifre_hash', '5550001122');

-- 8. Örnek Rezervasyon ve Bilet Ekle (Yeni Tarihlere Göre Güncellendi)
-- Ayşe Yılmaz, 15 Temmuz 2025 Ankara -> İstanbul seferine bir bilet alsın.
-- Kullanıcı ID: 1, Sefer ID: 1, Koltuk ID: 5 (Vagon 1, Koltuk 3A)
INSERT INTO Rezervasyonlar (kullanici_id, toplam_ucret) VALUES
(1, 450.00);

INSERT INTO Biletler (rezervasyon_id, sefer_id, koltuk_id, yolcu_ad, yolcu_soyad, pnr_kodu, bilet_fiyati) VALUES
(1, 1, 5, 'Ayşe', 'Yılmaz', 'AY789X', 450.00);