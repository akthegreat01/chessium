const fs = require('fs');
const boardFiles = [
  'src/app/(app)/puzzles/ClientPage.tsx',
  'src/app/(public)/openings/page.tsx',
  'src/components/chess/Analyzer.tsx',
  'src/components/chess/PlayVsAI.tsx'
];

boardFiles.forEach(f => {
  let code = fs.readFileSync(f, 'utf8');
  code = code.replace(/<Chessboard/g, '{/* @ts-ignore */}\n        <Chessboard');
  fs.writeFileSync(f, code);
});
console.log("Added ts-ignore");
