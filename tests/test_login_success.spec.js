const { test, expect } = require('@playwright/test');

test('successful admin login', async ({ page }) => {
  // Sunucunun çalıştığından emin olun ve login.html sayfasına gidin
  await page.goto('http://localhost:3000/login.html');

  // Formu admin bilgileriyle doldurun
  await page.fill('input[name="email"]', '63ayldzmstf.21@gmail.com');
  await page.fill('input[name="sifre"]', 'admin123');

  // Butona tıklayın
  await page.click('button[type="submit"]');

  // Yönlendirmeyi bekleyin ve URL'in admin.html olduğunu doğrulayın
  await page.waitForURL('**/admin.html');
  await expect(page).toHaveURL('http://localhost:3000/admin.html');

  // Admin sayfasında beklenen bir başlık olduğunu doğrulayın
  const heading = await page.textContent('h1');
  expect(heading).toBe('Admin Paneli');

  // Başarılı bir ekran görüntüsü alın
  await page.screenshot({ path: 'tests/screenshots/login_success.png' });
});