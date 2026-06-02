import { PGNHeaders } from "@/types/chess";

export function parsePGN(pgnText: string): { headers: PGNHeaders; moves: string } {
  const lines = pgnText.split("\n");
  const headers: Partial<PGNHeaders> = {};
  let movesStartIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("[") && line.endsWith("]")) {
      const match = line.match(/\[(\w+)\s+"(.*)"\]/);
      if (match) {
        const key = match[1] as keyof PGNHeaders;
        headers[key] = match[2];
      }
    } else if (line !== "" && movesStartIdx === -1) {
      movesStartIdx = i;
    }
  }

  const moves = movesStartIdx !== -1 
    ? lines.slice(movesStartIdx).join(" ").trim() 
    : "";

  return { 
    headers: headers as PGNHeaders, 
    moves 
  };
}

export function splitMultiGamePGN(pgnText: string): string[] {
  // PGN games are separated by a blank line followed by a tag
  const games = pgnText.split(/\n\s*\n(?=\[Event )/);
  return games.map(g => g.trim()).filter(Boolean);
}

export async function parsePGNFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string || "");
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}
