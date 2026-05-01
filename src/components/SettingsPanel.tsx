"use client";

import { useState } from 'react';
import { useChessStore } from '@/lib/chessStore';
import { Settings, Volume2, VolumeX, RotateCw, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPanel() {
  const {
    soundEnabled, toggleSound,
    flipBoard, boardFlipped,
    analysisDepth, setAnalysisDepth,
  } = useChessStore();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors text-gray-400 hover:text-gray-200"
        title="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="glass-panel p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-lg">
                  <Sliders className="w-5 h-5 text-[#0f1013]" />
                </div>
                <h2 className="text-xl font-bold text-white">Settings</h2>
              </div>

              <div className="flex flex-col gap-5">
                {/* Sound Toggle */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-green-500" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
                    <span className="text-sm text-gray-200">Sound Effects</span>
                  </div>
                  <button
                    onClick={toggleSound}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      soundEnabled ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                      soundEnabled ? 'left-6' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                {/* Board Flip */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <RotateCw className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-200">Board Flipped</span>
                  </div>
                  <button
                    onClick={flipBoard}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      boardFlipped ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                      boardFlipped ? 'left-6' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                {/* Analysis Depth */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-200">Analysis Depth</span>
                    <span className="text-sm font-mono text-green-400">{analysisDepth}</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="24"
                    value={analysisDepth}
                    onChange={(e) => setAnalysisDepth(parseInt(e.target.value))}
                    className="w-full accent-green-500 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>Fast (8)</span>
                    <span>Deep (24)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full mt-6 py-2 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] text-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
