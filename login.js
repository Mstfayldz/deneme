document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const hataMesajiElementi = document.getElementById('hata-mesaji');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        hataMesajiElementi.textContent = ''; // Önceki hata mesajını temizle

        const email = event.target.elements.email.value;
        const sifre = event.target.elements.sifre.value;

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, sifre }),
            });

            const data = await response.json();

            if (data.success) {
                if (data.isAdmin) {
                    // Admin girişi başarılı, admin paneline yönlendir.
                    window.location.href = 'admin.html';
                } else {
                    hataMesajiElementi.textContent = 'Giriş başarılı fakat admin yetkiniz bulunmuyor.';
                }
            } else {
                hataMesajiElementi.textContent = data.message || 'Bir hata oluştu.';
            }

        } catch (error) {
            console.error('Giriş sırasında bir ağ hatası oluştu:', error);
            hataMesajiElementi.textContent = 'Sunucuya bağlanılamadı. Lütfen tekrar deneyin.';
        }
    });
});