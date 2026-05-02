const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 3000));
  
  // Also dump HTML structure of right panel to see if it's there
  const html = await page.evaluate(() => {
    const panels = document.querySelectorAll('.glass-panel');
    return Array.from(panels).map(p => p.textContent.substring(0, 50));
  });
  console.log('Panels:', html);
  
  await browser.close();
})();
