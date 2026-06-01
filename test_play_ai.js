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
    const response = await page.goto('http://localhost:3001/play/ai', { waitUntil: 'networkidle0', timeout: 15000 });
    console.log("HTTP STATUS:", response.status());
    console.log("Page loaded successfully.");
    const content = await page.content();
    console.log("CONTENT LENGTH:", content.length);
  } catch (e) {
    console.log("Navigation failed:", e.message);
  }
  
  await browser.close();
})();
