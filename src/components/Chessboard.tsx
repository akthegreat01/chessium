"use client";

import { useMemo, useState, useEffect, useRef } from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { useChessStore, BOARD_THEMES } from '@/lib/chessStore';
import { Palette, Lightbulb, BookOpen, Star, ThumbsUp, Check, X } from 'lucide-react';

// Classification metadata with chess.com-style icons
const classData: Record<string, { color: string; type: string; label: string }> = {
  brilliant:   { color: '#1cb0f6', type: '!!', label: 'Brilliant' },
  great:       { color: '#5c8bb0', type: '!',  label: 'Great' },
  best:        { color: '#81b64c', type: 'star', label: 'Best' },
  excellent:   { color: '#96bc4b', type: 'thumbsup', label: 'Excellent' },
  good:        { color: '#96af8b', type: 'check', label: 'Good' },
  book:        { color: '#d5a47d', type: 'book', label: 'Book' },
  inaccuracy:  { color: '#f7c545', type: '?!', label: 'Inaccuracy' },
  mistake:     { color: '#ffa459', type: '?',  label: 'Mistake' },
  miss:        { color: '#ff7769', type: 'miss', label: 'Miss' },
  blunder:     { color: '#fa412d', type: '??', label: 'Blunder' },
  forced:      { color: '#737373', type: 'forced', label: 'Forced' },
};

// Convert square name to pixel position on the board
function squareToPosition(square: string, boardWidth: number, flipped: boolean) {
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1]) - 1;
  const squareSize = boardWidth / 8;

  const col = flipped ? 7 - file : file;
  const row = flipped ? rank : 7 - rank;

  return {
    left: col * squareSize,
    top: row * squareSize,
    squareSize,
  };
}

export default function Chessboard() {
  const {
    fen, makeMove, history, currentMoveIndex,
    analysisResult, boardTheme, setBoardTheme, boardFlipped,
    showHint, hintMove, showHintMove, hideHint,
    selectedSquare, legalMovesForSelected, selectSquare,
    variationAnalysis, mainLineHistory,
  } = useChessStore();
  const [showThemes, setShowThemes] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = useState(0);

  // Track actual rendered board width for icon positioning
  useEffect(() => {
    if (!boardRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        setBoardWidth(prev => {
          // Only update if the width has actually changed significantly
          if (Math.abs(prev - newWidth) < 0.1) return prev;
          return newWidth;
        });
      }
    });
    observer.observe(boardRef.current);
    return () => observer.disconnect();
  }, []);

  function onDrop(args: { piece: { isSparePiece: boolean; position: string; pieceType: string }; sourceSquare: string; targetSquare: string | null }) {
    if (!args.targetSquare) return false;
    const pieceType = args.piece?.pieceType || '';
    const isPromotion = (pieceType === 'P' || pieceType === 'p') &&
      (args.targetSquare[1] === '8' || args.targetSquare[1] === '1');
    return makeMove({
      from: args.sourceSquare,
      to: args.targetSquare,
      promotion: isPromotion ? 'q' : undefined,
    });
  }

  // Handle click-to-move via square clicks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSquareClick = (args: any) => {
    if (args?.square) selectSquare(args.square);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPieceClick = (args: any) => {
    if (args?.square) selectSquare(args.square);
  };

  // Build arrows for analysis best move
  const customArrows = useMemo(() => {
    const arrows: { startSquare: string; endSquare: string; color: string }[] = [];

    if (showHint && hintMove) {
      arrows.push({ startSquare: hintMove.substring(0, 2), endSquare: hintMove.substring(2, 4), color: 'rgba(16, 185, 129, 0.8)' });
      return arrows;
    }

    // Show the engine's best move arrow for the CURRENT board position.
    // We only show these if we are on the main analyzed line.
    if (analysisResult && currentMoveIndex >= -1 && !mainLineHistory) {
      const nextIndex = currentMoveIndex + 1;
      if (nextIndex < analysisResult.moveAnalyses.length) {
        const bestMoveUci = analysisResult.moveAnalyses[nextIndex].bestMove;
        if (bestMoveUci && bestMoveUci.length >= 4 && bestMoveUci !== '(none)') {
          arrows.push({
            startSquare: bestMoveUci.substring(0, 2) as any,
            endSquare: bestMoveUci.substring(2, 4) as any,
            color: 'rgba(16, 185, 129, 0.6)'
          });
        }
      }
    }

    return arrows;
  }, [showHint, hintMove, analysisResult, currentMoveIndex]);

  // Determine classification for the current move
  const lastMoveFrom = currentMoveIndex >= 0 ? history[currentMoveIndex]?.from : null;
  const lastMoveSquare = currentMoveIndex >= 0 ? history[currentMoveIndex]?.to : null;

  // Use variation analysis if we're in a side line, otherwise use main analysis
  let classification: string | null = null;
  let classInfo: { color: string; type: string; label: string } | null = null;

  if (variationAnalysis && mainLineHistory) {
    // We're exploring a variation - use the instant analysis
    classification = variationAnalysis.classification;
    classInfo = classData[classification] || null;
  } else if (currentMoveIndex >= 0 && analysisResult) {
    classification = analysisResult.classifications[currentMoveIndex] || null;
    classInfo = classification ? classData[classification] : null;
  }

  // Build square styles: highlight selected square + legal moves + last move
  const customSquareStyles: Record<string, React.CSSProperties> = {};
  if (lastMoveFrom) {
    customSquareStyles[lastMoveFrom] = { backgroundColor: classInfo ? `${classInfo.color}30` : 'rgba(16, 185, 129, 0.25)' };
  }
  if (lastMoveSquare) {
    customSquareStyles[lastMoveSquare] = { backgroundColor: classInfo ? `${classInfo.color}40` : 'rgba(16, 185, 129, 0.35)' };
  }
  // Highlight selected square
  if (selectedSquare) {
    customSquareStyles[selectedSquare] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
  }
  // Highlight legal move targets with dots
  for (const sq of legalMovesForSelected) {
    customSquareStyles[sq] = {
      background: 'radial-gradient(circle, rgba(0,0,0,0.25) 25%, transparent 25%)',
      borderRadius: '50%',
    };
  }

  const orientation: 'white' | 'black' = boardFlipped ? 'black' : 'white';

  const boardOptions = useMemo(() => ({
    position: fen,
    onPieceDrop: onDrop,
    onSquareClick: onSquareClick,
    onPieceClick: onPieceClick,
    boardOrientation: orientation,
    darkSquareStyle: { backgroundColor: boardTheme.dark },
    lightSquareStyle: { backgroundColor: boardTheme.light },
    squareStyles: customSquareStyles,
    arrows: customArrows,
    animationDurationInMs: 150,
    boardStyle: { borderRadius: '4px' },
    dropSquareStyle: { boxShadow: 'inset 0 0 1px 6px rgba(16, 185, 129, 0.4)' },
  }), [fen, onDrop, onSquareClick, onPieceClick, orientation, boardTheme, customSquareStyles, customArrows]);

  // Calculate icon position on the destination square (top-right corner like chess.com)
  const iconPos = lastMoveSquare && classInfo && boardWidth > 0
    ? squareToPosition(lastMoveSquare, boardWidth, boardFlipped)
    : null;
  const iconSize = boardWidth > 0 ? Math.max(16, boardWidth / 8 * 0.38) : 20;

  // Function to render the specific icon
  const renderIcon = (type: string, size: number) => {
    const iSize = size * 0.6;
    switch (type) {
      case '!!': return <span className="text-white font-black tracking-tighter" style={{ fontSize: iSize, transform: 'scaleX(0.85)' }}>!!</span>;
      case '!':  return <span className="text-white font-black" style={{ fontSize: iSize }}>!</span>;
      case '?!': return <span className="text-white font-black tracking-tighter" style={{ fontSize: iSize, transform: 'scaleX(0.85)' }}>?!</span>;
      case '?':  return <span className="text-white font-black" style={{ fontSize: iSize }}>?</span>;
      case '??': return <span className="text-white font-black tracking-tighter" style={{ fontSize: iSize, transform: 'scaleX(0.85)' }}>??</span>;
      case 'book': return <BookOpen className="text-white" size={iSize} fill="currentColor" strokeWidth={1} />;
      case 'star': return <Star className="text-white" size={iSize} fill="currentColor" strokeWidth={1} />;
      case 'thumbsup': return <ThumbsUp className="text-white" size={iSize} fill="currentColor" strokeWidth={1} />;
      case 'check': return <Check className="text-white" size={iSize} strokeWidth={4} />;
      case 'miss': return <X className="text-white" size={iSize} strokeWidth={4} />;
      case 'forced': return <span className="text-white font-black" style={{ fontSize: iSize }}>→</span>;
      default: return null;
    }
  };

  return (
    <div ref={boardRef} className="relative w-full aspect-square">
      {/* @ts-ignore */}
      <ReactChessboard options={boardOptions} />

      {/* Chess.com-style classification icon on the destination square */}
      {iconPos && classInfo && (
        <div
          className="absolute pointer-events-none z-[100]"
          style={{
            left: iconPos.left + iconPos.squareSize - iconSize / 2,
            top: iconPos.top - iconSize / 2,
            width: iconSize,
            height: iconSize,
          }}
        >
          <div
            className="w-full h-full rounded-full flex items-center justify-center shadow-lg border-2 border-white/80"
            style={{ backgroundColor: classInfo.color }}
          >
            {renderIcon(classInfo.type, iconSize)}
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1.5">
        <button
          onClick={() => showHint ? hideHint() : showHintMove()}
          className={`p-1.5 rounded-md transition-all ${
            showHint
              ? 'bg-green-500/30 text-green-400'
              : 'bg-black/50 hover:bg-black/70 text-white/70 hover:text-white'
          }`}
          title="Show Hint (H)"
        >
          <Lightbulb className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowThemes(!showThemes)}
          className="bg-black/50 hover:bg-black/70 p-1.5 rounded-md text-white/70 hover:text-white transition-colors"
          title="Board Theme"
        >
          <Palette className="w-4 h-4" />
        </button>

        {showThemes && (
          <div className="bg-[#121318] border border-white/10 rounded-lg p-2 shadow-xl flex flex-col gap-1 min-w-[140px]">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Theme</p>
            {BOARD_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => { setBoardTheme(theme); setShowThemes(false); }}
                className={`flex items-center gap-2 w-full text-left p-1.5 rounded hover:bg-white/5 transition-colors text-xs ${boardTheme.id === theme.id ? 'bg-white/10 text-white' : 'text-gray-400'}`}
              >
                <div className="flex w-5 h-5 rounded overflow-hidden border border-white/15">
                  <div className="w-1/2 h-full" style={{ backgroundColor: theme.light }} />
                  <div className="w-1/2 h-full" style={{ backgroundColor: theme.dark }} />
                </div>
                {theme.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
