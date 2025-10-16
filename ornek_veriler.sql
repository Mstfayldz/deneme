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

-- 6. Seferleri Ekle
INSERT INTO Seferler (tren_id, hat_id, kalkis_zamani, varis_zamani, durum) VALUES
(1, 1, '2024-10-20 08:00:00', '2024-10-20 12:30:00', 'Planlandı'), -- Ankara -> İstanbul
(1, 2, '2024-10-20 14:00:00', '2024-10-20 18:30:00', 'Planlandı'), -- İstanbul -> Ankara
(2, 3, '2024-10-21 09:00:00', '2024-10-21 10:45:00', 'Planlandı'), -- Ankara -> Konya
(2, 4, '2024-10-21 15:00:00', '2024-10-21 16:45:00', 'Planlandı'); -- Konya -> Ankara

-- 7. Kullanıcıları Ekle
INSERT INTO Kullanicilar (ad, soyad, email, sifre, telefon) VALUES
('Ayşe', 'Yılmaz', 'ayse.yilmaz@example.com', 'gizli_sifre_hash', '5550001122');

-- 8. Örnek Rezervasyon ve Bilet Ekle
-- Ayşe Yılmaz, Ankara -> İstanbul seferine bir bilet alsın.
-- Kullanıcı ID: 1, Sefer ID: 1, Koltuk ID: 10 (Vagon 1, Koltuk 5B)
INSERT INTO Rezervasyonlar (kullanici_id, toplam_ucret) VALUES
(1, 350.50);

INSERT INTO Biletler (rezervasyon_id, sefer_id, koltuk_id, yolcu_ad, yolcu_soyad, pnr_kodu, bilet_fiyati) VALUES
(1, 1, 10, 'Ayşe', 'Yılmaz', 'TRK9X1', 350.50);