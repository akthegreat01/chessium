"use client";

import { useState } from 'react';
import { fetchChessComGames, fetchLichessGames, ApiGame } from '@/lib/chessApi';
import { useChessStore } from '@/lib/chessStore';
import { Search, Download, Bookmark, Save, FileText, Copy, AlertCircle, MonitorPlay, Bot } from 'lucide-react';
import PlayBotModal from './PlayBotModal';

export default function GameImport() {
  const [username, setUsername] = useState('');
  const [platform, setPlatform] = useState<'chesscom' | 'lichess'>('chesscom');
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<ApiGame[]>([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'paste'>('search');
  const [pasteText, setPasteText] = useState('');
  const [pasteError, setPasteError] = useState('');
  const [showBotModal, setShowBotModal] = useState(false);
  
  const { loadPgn, loadFen, saveGame, savedGames } = useChessStore();

  const pgn = useChessStore((state) => state.game.pgn());
  const fen = useChessStore((state) => state.fen);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setLoading(true);
    setError('');
    setGames([]);
    
    try {
      const fetchedGames = platform === 'chesscom' 
        ? await fetchChessComGames(username) 
        : await fetchLichessGames(username);
        
      if (fetchedGames.length === 0) {
        setError('No recent games found for this user.');
      } else {
        setGames(fetchedGames);
      }
    } catch (err) {
      setError('Failed to fetch games. Check username and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = () => {
    setPasteError('');
    const text = pasteText.trim();
    if (!text) {
      setPasteError('Please paste a PGN or FEN string.');
      return;
    }

    // Try to detect if it's a FEN (single line with ranks separated by /)
    const isFen = /^[rnbqkpRNBQKP1-8/]+ [wb] [KQkq-]+ [a-h1-8-]+ \d+ \d+$/.test(text);
    
    if (isFen) {
      try {
        loadFen(text);
        setPasteText('');
        setPasteError('');
      } catch {
        setPasteError('Invalid FEN string.');
      }
    } else {
      try {
        loadPgn(text);
        setPasteText('');
        setPasteError('');
      } catch {
        setPasteError('Invalid PGN. Check format and try again.');
      }
    }
  };

  const handleSaveCurrent = () => {
    if (pgn) {
      saveGame({
        id: Math.random().toString(36).substring(7),
        pgn,
        white: "White",
        black: "Black",
        date: new Date().toLocaleDateString()
      });
    }
  };

  return (
    <div className="glass-panel p-3 flex flex-col gap-3">
      {/* Play vs Computer Button */}
      <button 
        onClick={() => setShowBotModal(true)}
        className="w-full relative overflow-hidden group bg-gradient-to-r from-red-600/20 via-purple-600/20 to-blue-600/20 hover:from-red-600/30 hover:to-blue-600/30 border border-red-500/20 text-white font-black py-3 rounded-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.01] shadow-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 ease-in-out skew-x-12" />
        <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
          <Bot className="w-4 h-4 text-red-400" />
        </div>
        <span className="tracking-wider uppercase text-sm">Challenge Stockfish</span>
      </button>

      <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.1)] pb-1.5 mt-1">
        <h2 className="font-semibold text-sm text-gray-200 uppercase tracking-wider flex items-center gap-2">
          <Download className="w-4 h-4 text-green-500" />
          Import Games
        </h2>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => {
              const blob = new Blob([pgn], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `chessium_${new Date().getTime()}.pgn`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            title="Download PGN File"
            className="p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.1)] transition-colors text-gray-400 hover:text-gray-200"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => navigator.clipboard.writeText(fen)}
            title="Copy FEN"
            className="p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.1)] transition-colors text-gray-400 hover:text-gray-200"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={handleSaveCurrent}
            title="Save Current Analysis"
            className="p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.1)] transition-colors text-green-400"
          >
            <Save className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 bg-[rgba(0,0,0,0.2)] rounded-lg">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-1.5 text-sm rounded-md transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'search' 
            ? 'bg-[rgba(255,255,255,0.1)] text-white shadow-sm' 
            : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          Search
        </button>
        <button
          onClick={() => setActiveTab('paste')}
          className={`flex-1 py-1.5 text-sm rounded-md transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'paste' 
            ? 'bg-[rgba(255,255,255,0.1)] text-white shadow-sm' 
            : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Paste PGN/FEN
        </button>
      </div>

      {/* Search Tab */}
      {activeTab === 'search' && (
        <>
          <form onSubmit={handleSearch} className="flex flex-col gap-3">
            <div className="flex gap-2 p-1 bg-[rgba(0,0,0,0.2)] rounded-lg">
              <button
                type="button"
                onClick={() => setPlatform('chesscom')}
                className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${
                  platform === 'chesscom' 
                  ? 'bg-[rgba(255,255,255,0.1)] text-white shadow-sm' 
                  : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Chess.com
              </button>
              <button
                type="button"
                onClick={() => setPlatform('lichess')}
                className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${
                  platform === 'lichess' 
                  ? 'bg-[rgba(255,255,255,0.1)] text-white shadow-sm' 
                  : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Lichess
              </button>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username..."
                  className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-lg py-2 pl-3 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
                />
                <Search className="w-4 h-4 text-gray-500 absolute right-3 top-2.5" />
              </div>
              <button
                type="submit"
                disabled={loading || !username.trim()}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-green-500/20 border border-green-400/20"
              >
                {loading ? '...' : 'Find'}
              </button>
            </div>
          </form>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 p-2 rounded-lg border border-red-500/20">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {games.length > 0 && (
            <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-1">
              <p className="text-xs text-gray-400 mb-1">{games.length} games found:</p>
              {games.map((g, i) => (
                <button
                  key={i}
                  onClick={() => loadPgn(g.pgn)}
                  className="text-left bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.05)] p-2 rounded-lg transition-colors flex flex-col gap-0.5"
                >
                  <div className="flex justify-between text-xs text-gray-300">
                    <span className="truncate max-w-[120px] font-medium text-white">{g.white}</span>
                    <span className="text-gray-500 text-[10px]">vs</span>
                    <span className="truncate max-w-[120px] font-medium text-black bg-gray-300 px-1.5 rounded">{g.black}</span>
                  </div>
                  <div className="text-[10px] text-gray-500">{g.date}</div>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Paste Tab */}
      {activeTab === 'paste' && (
        <div className="flex flex-col gap-3">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={`Paste PGN:\n1. e4 e5 2. Nf3 Nc6...\n\nOr FEN:\nrnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1`}
            className="w-full h-32 bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-green-500/50 transition-colors font-mono resize-none custom-scrollbar"
          />
          {pasteError && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 p-2 rounded-lg border border-red-500/20">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {pasteError}
            </div>
          )}
          <button
            onClick={handlePaste}
            disabled={!pasteText.trim()}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-green-500/20 border border-green-400/20"
          >
            Load Game
          </button>
        </div>
      )}

      {/* Saved Games */}
      {savedGames.length > 0 && (
        <div className="flex flex-col gap-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-1 border-t border-[rgba(255,255,255,0.05)] pt-3">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Bookmark className="w-3 h-3" /> Saved ({savedGames.length}):
          </p>
          {savedGames.map((g, i) => (
            <button
              key={i}
              onClick={() => loadPgn(g.pgn)}
              className="text-left bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.05)] p-2 rounded-lg transition-colors flex flex-col gap-1"
            >
              <div className="text-xs text-gray-300">Analysis from {g.date}</div>
            </button>
          ))}
        </div>
      )}

      {showBotModal && <PlayBotModal onClose={() => setShowBotModal(false)} />}
    </div>
  );
}
