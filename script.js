document.addEventListener('DOMContentLoaded', () => {
    const seferAramaFormu = document.getElementById('sefer-arama-formu');
    const sonuclarListesi = document.getElementById('sonuclar-listesi');

    seferAramaFormu.addEventListener('submit', async (event) => {
        event.preventDefault(); // Formun sayfayı yeniden yüklemesini engelle

        const kalkisNoktasi = event.target.elements.kalkis.value;
        const varisNoktasi = event.target.elements.varis.value;
        const tarih = event.target.elements.tarih.value;

        if (!tarih) {
            alert('Lütfen bir tarih seçiniz.');
            return;
        }

        // API'ye istek atmak için tam URL oluştur (tarih eklendi)
        const apiUrl = `http://localhost:3000/api/seferler?kalkis=${encodeURIComponent(kalkisNoktasi)}&varis=${encodeURIComponent(varisNoktasi)}&tarih=${tarih}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Ağ yanıtı sorunlu: ' + response.statusText);
            }
            const uygunSeferler = await response.json();

            // Sonuçları göster
            renderSonuclar(uygunSeferler);

        } catch (error) {
            console.error('Seferler alınırken hata oluştu:', error);
            sonuclarListesi.innerHTML = '<p>Seferler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.</p>';
        }
    });

    function renderSonuclar(seferler) {
        // Önceki sonuçları temizle
        sonuclarListesi.innerHTML = '';

        if (seferler.length === 0) {
            sonuclarListesi.innerHTML = '<p>Bu kriterlere uygun sefer bulunamadı.</p>';
            return;
        }

        seferler.forEach(sefer => {
            // Zaman formatını sadece Saat:Dakika olarak ayarla
            const kalkisSaati = new Date(sefer.kalkis_zamani).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
            const varisSaati = new Date(sefer.varis_zamani).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

            const seferKarti = document.createElement('div');
            seferKarti.className = 'sefer-karti';
            seferKarti.innerHTML = `
                <div class="bilgi">
                    <span class="saat">${kalkisSaati} - ${varisSaati}</span>
                    <br>
                    <span>${sefer.kalkis_noktasi} &rarr; ${sefer.varis_noktasi}</span>
                </div>
                <button onclick="biletAl(${sefer.sefer_id})">Bilet Al</button>
            `;
            sonuclarListesi.appendChild(seferKarti);
        });
    }
});

// Bilet al butonuna tıklandığında çalışacak örnek fonksiyon
function biletAl(seferId) {
    alert(`Sefer ID ${seferId} için bilet alma işlemi başlatıldı!`);
    // Gerçek uygulamada bu fonksiyon koltuk seçimi sayfasına yönlendirecektir.
}