const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });
  page.on('requestfailed', request => {
    console.log('NETWORK ERROR:', request.url(), request.failure()?.errorText);
  });

  page.on('response', response => {
    if (response.status() === 404) {
      console.log('404 Not Found:', response.url());
    }
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
        break;
      }
    } catch (e) {
      console.log("Failed to load", url, e.message);
    }
  }
  
  await browser.close();
})();
