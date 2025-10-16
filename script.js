document.addEventListener('DOMContentLoaded', () => {
    const seferAramaFormu = document.getElementById('sefer-arama-formu');
    const sonuclarListesi = document.getElementById('sonuclar-listesi');

    // Backend olmadığından, ornek_veriler.sql dosyasındaki verilere dayalı sahte bir veri seti kullanalım.
    const mockSeferler = [
        {
            id: 1,
            kalkis: 'Ankara Garı',
            varis: 'Söğütlüçeşme',
            kalkisZamani: '08:00',
            varisZamani: '12:30',
            trenModeli: 'YHT800'
        },
        {
            id: 2,
            kalkis: 'Söğütlüçeşme',
            varis: 'Ankara Garı',
            kalkisZamani: '14:00',
            varisZamani: '18:30',
            trenModeli: 'YHT800'
        },
        {
            id: 3,
            kalkis: 'Ankara Garı',
            varis: 'Konya Garı',
            kalkisZamani: '09:00',
            varisZamani: '10:45',
            trenModeli: 'YHT950'
        },
        {
            id: 4,
            kalkis: 'Konya Garı',
            varis: 'Ankara Garı',
            kalkisZamani: '15:00',
            varisZamani: '16:45',
            trenModeli: 'YHT950'
        }
    ];

    seferAramaFormu.addEventListener('submit', (event) => {
        event.preventDefault(); // Formun sayfayı yeniden yüklemesini engelle

        const kalkisNoktasi = event.target.elements.kalkis.value;
        const varisNoktasi = event.target.elements.varis.value;
        // const tarih = event.target.elements.tarih.value; // Tarih şu anki mock yapısında kullanılmıyor.

        // Girilen kriterlere göre seferleri filtrele
        const uygunSeferler = mockSeferler.filter(sefer => {
            return sefer.kalkis === kalkisNoktasi && sefer.varis === varisNoktasi;
        });

        // Sonuçları göster
        renderSonuclar(uygunSeferler);
    });

    function renderSonuclar(seferler) {
        // Önceki sonuçları temizle
        sonuclarListesi.innerHTML = '';

        if (seferler.length === 0) {
            sonuclarListesi.innerHTML = '<p>Bu kriterlere uygun sefer bulunamadı.</p>';
            return;
        }

        seferler.forEach(sefer => {
            const seferKarti = document.createElement('div');
            seferKarti.className = 'sefer-karti';
            seferKarti.innerHTML = `
                <div class="bilgi">
                    <span class="saat">${sefer.kalkisZamani} - ${sefer.varisZamani}</span>
                    <br>
                    <span>${sefer.kalkis} &rarr; ${sefer.varis}</span>
                </div>
                <button onclick="biletAl(${sefer.id})">Bilet Al</button>
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