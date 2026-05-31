const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  // Capture all console logs and errors
  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => {
    console.log('NETWORK ERROR:', request.url(), request.failure().errorText);
  });

  console.log("Navigating to http://localhost:3000/play/ai");
  await page.goto('http://localhost:3000/play/ai', { waitUntil: 'networkidle0' });
  
  console.log("Clicking Start Match");
  const startBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Start Match'));
  });
  
  if (startBtn) {
    await startBtn.click();
    console.log("Clicked start match");
  } else {
    console.log("Failed to find Start Match button");
  }
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Test click-to-move since dragging in puppeteer can be flaky
  console.log("Testing click-to-move: e2 to e4");
  
  const e2Square = await page.$('[data-square="e2"]');
  if (e2Square) {
    await e2Square.click();
    console.log("Clicked e2");
    await new Promise(r => setTimeout(r, 500));
    
    const e4Square = await page.$('[data-square="e4"]');
    if (e4Square) {
      await e4Square.click();
      console.log("Clicked e4");
    } else {
      console.log("e4 square not found");
    }
  } else {
    console.log("e2 square not found");
  }
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Check if piece moved to e4
  const html = await page.evaluate(() => document.body.innerHTML);
  if (html.includes("data-square=\"e4\"") && html.includes("wP")) {
    console.log("SUCCESS: Piece moved to e4");
  } else {
    console.log("FAILED: Piece did not move. Checking board DOM:");
    const e4Inner = await page.evaluate(() => {
      const el = document.querySelector('[data-square="e4"]');
      return el ? el.innerHTML : 'not found';
    });
    console.log("e4 square contains:", e4Inner);
  }
  
  await browser.close();
})();
