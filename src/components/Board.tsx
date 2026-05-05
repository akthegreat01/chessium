"use client";

import { useMemo, useState, useEffect, useRef } from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { useChessStore, BOARD_THEMES } from '@/lib/chessStore';
import { useUserStore } from '@/lib/userStore';
import { Palette, Lightbulb, BookOpen, Star, ThumbsUp, Check, X, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

function squareToPosition(square: string, boardWidth: number, flipped: boolean) {
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1]) - 1;
  const squareSize = boardWidth / 8;
  const col = flipped ? 7 - file : file;
  const row = flipped ? rank : 7 - rank;
  return { left: col * squareSize, top: row * squareSize, squareSize };
}

export default function Board() {
  const {
    fen, makeMove, history, currentMoveIndex,
    analysisResult, boardTheme, setBoardTheme, boardFlipped,
    showHint, hintMove, showHintMove, hideHint,
    selectedSquare, legalMovesForSelected, selectSquare,
    variationAnalysis, mainLineHistory,
    explainWhyLine, setExplainWhyLine,
    openingName,
    userArrows, userSquares, setUserArrows, toggleUserSquare, clearAnnotations,
    premove, setPremove, clearPremove, premovesEnabled,
    playingAI, playerColor
  } = useChessStore();
  
  const [showThemes, setShowThemes] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = useState(0);

  useEffect(() => {
    if (!boardRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setBoardWidth(entry.contentRect.width);
      }
    });
    observer.observe(boardRef.current);
    return () => observer.disconnect();
  }, []);

  // v5.10 API: onPieceDrop receives { piece, sourceSquare, targetSquare }
  const onDrop = ({ piece, sourceSquare, targetSquare }: any) => {
    if (!targetSquare) return false;
    
    // piece is a string like "wP", "bK"
    const pieceColor = piece[0];
    const pieceType = piece[1].toLowerCase();
    
    const { game, playerColor, playingAI } = useChessStore.getState();
    
    // Prevent moving bot pieces
    if (playingAI && pieceColor !== playerColor) return false;

    const isPromotion = pieceType === 'p' && (targetSquare[1] === '8' || targetSquare[1] === '1');
    const move = { from: sourceSquare, to: targetSquare, promotion: isPromotion ? 'q' : undefined };

    const isMyTurn = !playingAI || game.turn() === playerColor;

    if (!isMyTurn && premovesEnabled) {
      setPremove(move);
      return true;
    }

    const success = makeMove(move);
    if (success) {
      clearAnnotations();
      clearPremove();
    }
    return success;
  };

  // v5.10 API: onSquareClick receives { piece, square }
  const onSquareClick = ({ square }: any) => {
    selectSquare(square);
    clearAnnotations();
  };

  // v5.10 API: onSquareRightClick receives { piece, square }
  const onSquareRightClick = ({ square }: any) => {
    if (premove) {
      clearPremove();
    } else {
      toggleUserSquare(square, 'rgba(255, 170, 0, 0.4)');
    }
  };

  // v5.10 API: onArrowsChange receives { arrows }
  const onArrowsChange = ({ arrows }: any) => {
    setUserArrows(arrows);
  };

  const customArrows = useMemo(() => {
    const arrows: any[] = [];
    if (userArrows) {
      for (let i = 0; i < userArrows.length; i++) arrows.push(userArrows[i]);
    }
    if (showHint && hintMove) {
      arrows.push({ startSquare: hintMove.substring(0, 2), endSquare: hintMove.substring(2, 4), color: 'rgba(16, 185, 129, 0.8)' });
    }
    if (explainWhyLine && explainWhyLine.length >= 2) {
      for (let i = 0; i < explainWhyLine.length - 1; i++) {
        arrows.push({ startSquare: explainWhyLine[i].substring(0, 2), endSquare: explainWhyLine[i].substring(2, 4), color: i === 0 ? 'rgba(250, 65, 45, 0.8)' : 'rgba(255, 255, 255, 0.5)' });
      }
    }
    if (variationAnalysis && !mainLineHistory) {
      arrows.push({ startSquare: variationAnalysis.bestMove.substring(0, 2), endSquare: variationAnalysis.bestMove.substring(2, 4), color: 'rgba(16, 185, 129, 0.5)' });
    }
    if (analysisResult && currentMoveIndex >= -1 && !mainLineHistory) {
      const nextIndex = currentMoveIndex + 1;
      if (nextIndex < analysisResult.moveAnalyses.length) {
        const bestMoveUci = analysisResult.moveAnalyses[nextIndex].bestMove;
        if (bestMoveUci && bestMoveUci.length >= 4 && bestMoveUci !== '(none)') {
          arrows.push({ startSquare: bestMoveUci.substring(0, 2), endSquare: bestMoveUci.substring(2, 4), color: 'rgba(16, 185, 129, 0.6)' });
        }
      }
    }
    return arrows;
  }, [showHint, hintMove, analysisResult, currentMoveIndex, userArrows, explainWhyLine, variationAnalysis, mainLineHistory]);

  const lastMoveSquare = currentMoveIndex >= 0 ? history[currentMoveIndex]?.to : null;
  const lastMoveFrom = currentMoveIndex >= 0 ? history[currentMoveIndex]?.from : null;

  let classification: string | null = null;
  let classInfo: any = null;
  if (variationAnalysis && mainLineHistory) {
    classification = variationAnalysis.classification;
    classInfo = classData[classification] || null;
  } else if (currentMoveIndex >= 0 && analysisResult && currentMoveIndex < analysisResult.classifications.length) {
    classification = analysisResult.classifications[currentMoveIndex] || null;
    classInfo = classification ? classData[classification] : null;
  }

  const { triggerCelebration } = useUserStore();
  useEffect(() => {
    if (classification === 'brilliant') triggerCelebration('brilliant');
  }, [classification, triggerCelebration]);

  const customSquareStyles: any = {};
  if (userSquares) {
    const keys = Object.keys(userSquares);
    for (let i = 0; i < keys.length; i++) {
      customSquareStyles[keys[i]] = userSquares[keys[i]];
    }
  }
  if (lastMoveFrom) {
    const base = customSquareStyles[lastMoveFrom] || {};
    customSquareStyles[lastMoveFrom] = Object.assign({}, base, { backgroundColor: classInfo ? `${classInfo.color}30` : 'rgba(16, 185, 129, 0.25)' });
  }
  if (lastMoveSquare) {
    const base = customSquareStyles[lastMoveSquare] || {};
    customSquareStyles[lastMoveSquare] = Object.assign({}, base, { backgroundColor: classInfo ? `${classInfo.color}40` : 'rgba(16, 185, 129, 0.35)' });
  }
  if (selectedSquare) {
    const base = customSquareStyles[selectedSquare] || {};
    customSquareStyles[selectedSquare] = Object.assign({}, base, { backgroundColor: 'rgba(255, 255, 0, 0.4)' });
  }
  
  if (premove) {
    customSquareStyles[premove.from] = { backgroundColor: 'rgba(239, 68, 68, 0.4)' };
    customSquareStyles[premove.to] = { backgroundColor: 'rgba(239, 68, 68, 0.6)' };
  }

  for (let i = 0; i < legalMovesForSelected.length; i++) {
    const sq = legalMovesForSelected[i];
    const base = customSquareStyles[sq] || {};
    customSquareStyles[sq] = Object.assign({}, base, { background: 'radial-gradient(circle, rgba(0,0,0,0.25) 25%, transparent 25%)', borderRadius: '50%' });
  }

  // Build options object for react-chessboard v5.10
  const boardOptions = useMemo(() => ({
    position: fen,
    onPieceDrop: onDrop,
    onSquareClick: onSquareClick,
    onSquareRightClick: onSquareRightClick,
    onArrowsChange: onArrowsChange,
    boardOrientation: boardFlipped ? 'black' as const : 'white' as const,
    darkSquareStyle: { backgroundColor: boardTheme.dark },
    lightSquareStyle: { backgroundColor: boardTheme.light },
    squareStyles: customSquareStyles,
    arrows: customArrows,
    animationDurationInMs: 150,
    boardStyle: { borderRadius: '4px' },
    dropSquareStyle: { boxShadow: 'inset 0 0 1px 6px rgba(16, 185, 129, 0.4)' },
    allowDragging: true,
    isDraggablePiece: ({ piece }: any) => {
      if (!playingAI) return true;
      return piece[0] === playerColor;
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [fen, boardFlipped, boardTheme, customSquareStyles, customArrows, playingAI, playerColor]);

  const iconPos = lastMoveSquare && classInfo && boardWidth > 0 ? squareToPosition(lastMoveSquare, boardWidth, boardFlipped) : null;
  const iconSize = boardWidth > 0 ? Math.max(16, boardWidth / 8 * 0.38) : 20;

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
    <div ref={boardRef} className="relative w-full aspect-square rounded-sm shadow-2xl">
      {openingName && (
        <div className="absolute -top-10 left-0 right-0 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 5 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-xl"
          >
            <span className="text-[11px] font-black text-[#d4af37] uppercase tracking-[0.15em]">{openingName}</span>
          </motion.div>
        </div>
      )}
      <ReactChessboard 
        position={boardOptions.position}
        onPieceDrop={boardOptions.onPieceDrop}
        onSquareClick={boardOptions.onSquareClick}
        onSquareRightClick={boardOptions.onSquareRightClick}
        onArrowsChange={boardOptions.onArrowsChange}
        boardOrientation={boardOptions.boardOrientation}
        customDarkSquareStyle={boardOptions.darkSquareStyle}
        customLightSquareStyle={boardOptions.lightSquareStyle}
        customSquareStyles={boardOptions.squareStyles}
        customArrows={boardOptions.arrows}
        animationDuration={boardOptions.animationDurationInMs}
        boardStyle={boardOptions.boardStyle}
        customDropSquareStyle={boardOptions.dropSquareStyle}
        isDraggablePiece={boardOptions.isDraggablePiece}
      />
      {iconPos && classInfo && (
        <div className="absolute pointer-events-none z-[100]" style={{ left: iconPos.left + iconPos.squareSize - iconSize / 2, top: iconPos.top - iconSize / 2, width: iconSize, height: iconSize }}>
          <div className="w-full h-full rounded-full flex items-center justify-center shadow-lg border-2 border-white/80" style={{ backgroundColor: classInfo.color }}>
            {renderIcon(classInfo.type, iconSize)}
          </div>
        </div>
      )}
      <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1.5">
        <button onClick={() => showHint ? hideHint() : showHintMove()} className={`p-1.5 rounded-md transition-all ${showHint ? 'bg-green-500/30 text-green-400' : 'bg-black/50 hover:bg-black/70 text-white/70 hover:text-white'}`} title="Show Hint (H)">
          <Lightbulb className="w-4 h-4" />
        </button>
        <button onClick={() => setShowThemes(!showThemes)} className="bg-black/50 hover:bg-black/70 p-1.5 rounded-md text-white/70 hover:text-white transition-colors" title="Board Theme">
          <Palette className="w-4 h-4" />
        </button>
        <AnimatePresence>
          {showThemes && (
            <motion.div initial={{ opacity: 0, scale: 0.95, x: 10 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95, x: 10 }} className="bg-[#1a1b21] border border-white/10 rounded-xl p-2.5 shadow-2xl flex flex-col gap-2 min-w-[160px] backdrop-blur-md">
              <div className="flex items-center justify-between px-1">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Board Theme</p>
                <button onClick={() => setShowThemes(false)}><X className="w-3 h-3 text-gray-500 hover:text-white" /></button>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {BOARD_THEMES.map((theme) => (
                  <button key={theme.id} onClick={() => { setBoardTheme(theme); setShowThemes(false); }} className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all group ${boardTheme.id === theme.id ? 'border-green-500 shadow-lg shadow-green-500/20' : 'border-transparent hover:border-white/20'}`} title={theme.name}>
                    <div className="absolute inset-0 flex flex-col"><div className="flex-1" style={{ backgroundColor: theme.light }} /><div className="flex-1" style={{ backgroundColor: theme.dark }} /></div>
                    {boardTheme.id === theme.id && <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" /></div>}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {explainWhyLine && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-2 py-1 flex items-center gap-1.5 backdrop-blur-md animate-pulse">
            <Target className="w-3 h-3 text-red-400" />
            <span className="text-[10px] font-black text-red-100 uppercase tracking-tighter">Explaining why...</span>
          </div>
          <button onClick={() => setExplainWhyLine(null)} className="p-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
