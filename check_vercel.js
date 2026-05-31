const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => {
    console.log('NETWORK ERROR:', request.url(), request.failure().errorText);
  });

  const urlsToTry = [
    'https://chessium.vercel.app/play/ai',
    'https://chessium-akthegreat01s-projects.vercel.app/play/ai'
  ];

  for (const url of urlsToTry) {
    try {
      console.log("Navigating to", url);
      const response = await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
      if (response && response.status() === 200) {
        console.log("Found live site!");
        
        // Let's check headers
        const headers = response.headers();
        console.log("COEP:", headers['cross-origin-embedder-policy']);
        console.log("COOP:", headers['cross-origin-opener-policy']);
        
        await new Promise(r => setTimeout(r, 2000));
        break;
      }
    } catch (e) {
      console.log("Failed to load", url, e.message);
    }
  }
  
  await browser.close();
})();
