const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  await page.goto('https://chessium.vercel.app/play/ai', { waitUntil: 'networkidle0' });
  
  // Expose a function to test the worker directly in the browser
  const result = await page.evaluate(async () => {
    return new Promise((resolve) => {
      try {
        const worker = new Worker('/stockfish/stockfish.js');
        const timeout = setTimeout(() => {
          worker.terminate();
          resolve('TIMEOUT: No response from stockfish worker');
        }, 5000);
        
        worker.onmessage = (e) => {
          if (e.data.includes('uciok')) {
            clearTimeout(timeout);
            worker.terminate();
            resolve('SUCCESS: Received uciok');
          }
        };
        
        worker.onerror = (e) => {
          clearTimeout(timeout);
          worker.terminate();
          resolve('WORKER ERROR: ' + e.message);
        };
        
        worker.postMessage('uci');
      } catch (err) {
        resolve('ERROR CREATING WORKER: ' + err.message);
      }
    });
  });
  
  console.log("Stockfish Test Result:", result);
  
  await browser.close();
})();
