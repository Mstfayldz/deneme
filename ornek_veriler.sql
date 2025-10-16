-- Demiryolu Rezervasyon Sistemi için Örnek Veriler
-- Bu betik, geliştirme ve test aşamaları için veritabanını doldurur.

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
-- Not: ID'ler Istasyonlar tablosundaki sıraya göredir (Ankara:1, Söğütlüçeşme:2, etc.)
INSERT INTO Hatlar (kalkis_istasyon_id, varis_istasyon_id) VALUES
(1, 2), -- Ankara -> Söğütlüçeşme (İstanbul)
(2, 1), -- Söğütlüçeşme (İstanbul) -> Ankara
(1, 4), -- Ankara -> Konya
(4, 1); -- Konya -> Ankara

-- 4. Vagonları Ekle
-- YHT800 model tren için vagonlar (tren_id = 1)
INSERT INTO Vagonlar (tren_id, vagon_sira_no, vagon_tipi, koltuk_kapasitesi) VALUES
(1, 1, 'Business', 50),
(1, 2, 'Ekonomi', 60),
(1, 3, 'Ekonomi', 60),
-- YHT950 model tren için vagonlar (tren_id = 2)
(2, 1, 'Ekonomi', 60),
(2, 2, 'Ekonomi', 60);

-- 5. Koltukları Ekle
-- Bu kısım normalde bir betik veya uygulama kodu ile otomatik yapılır.
-- Örnek olması için birkaç vagonu manuel dolduralım.
-- Vagon 1 (Business, 50 koltuk)
INSERT INTO Koltuklar (vagon_id, koltuk_numarasi)
SELECT 1, CONCAT(FLOOR((n-1)/2) + 1, IF((n-1)%2=0, 'A', 'B')) FROM (
    SELECT a.N + b.N * 10 + 1 AS n
    FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
    CROSS JOIN (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) b
    ORDER BY n
) t WHERE n <= 50;

-- Vagon 2 (Ekonomi, 60 koltuk)
INSERT INTO Koltuklar (vagon_id, koltuk_numarasi)
SELECT 2, CONCAT(FLOOR((n-1)/3) + 1, CASE (n-1)%3 WHEN 0 THEN 'A' WHEN 1 THEN 'B' ELSE 'C' END) FROM (
    SELECT a.N + b.N * 10 + 1 AS n
    FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
    CROSS JOIN (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) b
    ORDER BY n
) t WHERE n <= 60;

-- 6. Seferleri Ekle
-- Not: ID'ler Hatlar ve Trenler tablosundaki sıraya göredir.
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
-- Kullanıcı ID: 1, Sefer ID: 1, Koltuk ID: 10 (Vagon 1 - Business, Koltuk 5B)
-- Rezervasyon oluşturuluyor
INSERT INTO Rezervasyonlar (kullanici_id, toplam_ucret) VALUES
(1, 350.50);

-- Bilet oluşturuluyor (rezervasyon_id = 1)
INSERT INTO Biletler (rezervasyon_id, sefer_id, koltuk_id, yolcu_ad, yolcu_soyad, pnr_kodu, bilet_fiyati) VALUES
(1, 1, 10, 'Ayşe', 'Yılmaz', 'TRK9X1', 350.50);