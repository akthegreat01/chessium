import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Analysis | Chessium",
  description: "Advanced browser-based chess analysis. Review your games, explore openings, and play against grandmaster-level Stockfish NNUE.",
};

export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
