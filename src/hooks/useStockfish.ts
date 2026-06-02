import { useState, useEffect, useCallback, useRef } from "react";

export function useStockfish() {
  const [isReady, setIsReady] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const callbacksRef = useRef<Map<string, (line: string) => void>>(new Map());

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const worker = new Worker("/stockfish/stockfish-18-lite-single.js");
        workerRef.current = worker;

        worker.onmessage = (e) => {
          const line = e.data as string;
          if (line === "readyok") setIsReady(true);
          callbacksRef.current.forEach((cb) => cb(line));
        };

        worker.postMessage("uci");
        worker.postMessage("isready");

        return () => {
          worker.terminate();
        };
      } catch (error) {
        console.error("Failed to initialize Stockfish worker", error);
      }
    }
  }, []);

  const sendCommand = useCallback((cmd: string) => {
    workerRef.current?.postMessage(cmd);
  }, []);

  const onMessage = useCallback((id: string, cb: (line: string) => void) => {
    callbacksRef.current.set(id, cb);
    return () => {
      callbacksRef.current.delete(id);
    };
  }, []);

  const evaluatePosition = useCallback(
    (fen: string, depth: number = 15): Promise<{ score: number; mate: number | null; pv: string[] }> => {
      return new Promise((resolve) => {
        let bestScore = 0;
        let mateIn: number | null = null;
        let bestPv: string[] = [];

        const cleanup = onMessage("eval-" + Date.now(), (line) => {
          if (line.includes("info depth")) {
            // Extract score
            const cpMatch = line.match(/score cp (-?\d+)/);
            if (cpMatch) {
              bestScore = parseInt(cpMatch[1], 10);
              mateIn = null;
            }
            
            // Extract mate
            const mateMatch = line.match(/score mate (-?\d+)/);
            if (mateMatch) {
              mateIn = parseInt(mateMatch[1], 10);
            }

            // Extract PV
            const pvMatch = line.match(/ pv (.*)/);
            if (pvMatch) {
              bestPv = pvMatch[1].trim().split(" ");
            }
          }

          if (line.includes("bestmove")) {
            cleanup();
            resolve({ score: bestScore, mate: mateIn, pv: bestPv });
          }
        });

        sendCommand(`position fen ${fen}`);
        sendCommand(`go depth ${depth}`);
      });
    },
    [sendCommand, onMessage]
  );

  return { sendCommand, onMessage, evaluatePosition, isReady };
}
