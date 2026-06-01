const puppeteer = require('puppeteer');
const pgn = "1. e4 e5 2. Nf3 Nc6";
const encodedPgn = encodeURIComponent(pgn);

(async () => {
  console.log("Starting Puppeteer...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  console.log("Navigating to /analyze...");
  await page.goto(`http://localhost:3000/analyze?pgn=${encodedPgn}`);
  
  // Wait for DEBUG FEN to appear
  await page.waitForSelector('text/DEBUG FEN:', { timeout: 10000 });
  
  let fenText = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('div'));
    const debugDiv = divs.find(d => d.textContent.includes('DEBUG FEN:'));
    return debugDiv ? debugDiv.textContent : 'NOT FOUND';
  });
  console.log("Initial FEN Text:", fenText);
  
  // Get board piece positions (react-chessboard uses data-piece and inline styles for transforms)
  let piecesInitial = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-piece]')).map(p => ({
      piece: p.getAttribute('data-piece'),
      transform: p.style.transform
    })).slice(0, 3); // Just sample a few
  });
  console.log("Initial Pieces Sample:", piecesInitial);
  
  console.log("Clicking Next Move button...");
  // Find the button with ChevronRight (lucide icon)
  await page.evaluate(() => {
    const svgs = Array.from(document.querySelectorAll('svg.lucide-chevron-right'));
    if (svgs.length > 0) {
      const btn = svgs[0].closest('button');
      if (btn) btn.click();
    }
  });
  
  await page.waitForTimeout(1000); // Wait for animation
  
  let fenTextAfter = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('div'));
    const debugDiv = divs.find(d => d.textContent.includes('DEBUG FEN:'));
    return debugDiv ? debugDiv.textContent : 'NOT FOUND';
  });
  console.log("After Click FEN Text:", fenTextAfter);
  
  let piecesAfter = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-piece]')).map(p => ({
      piece: p.getAttribute('data-piece'),
      transform: p.style.transform
    })).slice(0, 3);
  });
  console.log("After Click Pieces Sample:", piecesAfter);

  await browser.close();
  console.log("Done.");
})();
