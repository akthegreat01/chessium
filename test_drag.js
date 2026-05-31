const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));

  console.log("Navigating to /play/ai");
  await page.goto('http://localhost:3000/play/ai', { waitUntil: 'networkidle0' });
  
  console.log("Clicking Start Match");
  // Find the button by text
  const startBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Start Match'));
  });
  if (startBtn) {
    await startBtn.click();
  } else {
    console.log("Failed to find Start Match button");
  }
  
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("Trying to move piece e2 to e4");
  
  const e2Piece = await page.$('[data-square="e2"]');
  if (e2Piece) {
    const box = await e2Piece.boundingBox();
    if (box) {
      const e4Square = await page.$('[data-square="e4"]');
      const e4Box = await e4Square.boundingBox();
      
      if (e4Box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await new Promise(r => setTimeout(r, 100));
        await page.mouse.move(e4Box.x + e4Box.width / 2, e4Box.y + e4Box.height / 2, { steps: 10 });
        await page.mouse.up();
        console.log("Move performed");
      }
    }
  } else {
     console.log("No piece found on e2");
  }
  
  await new Promise(r => setTimeout(r, 1000));
  
  const html = await page.evaluate(() => document.body.innerHTML);
  if (html.includes("data-square=\"e4\"") && html.includes("wP")) {
    console.log("SUCCESS: Piece is on e4");
  } else {
    console.log("FAILED: Piece did not move");
  }
  
  await browser.close();
})();
