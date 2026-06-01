const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('requestfailed', request => {
    console.log('NETWORK ERROR:', request.url(), request.failure()?.errorText);
  });

  try {
    await page.goto('http://localhost:3000/play/ai', { waitUntil: 'networkidle0', timeout: 10000 });
    console.log("Page loaded successfully.");
  } catch (e) {
    console.log("Navigation failed:", e.message);
  }
  
  await browser.close();
})();
