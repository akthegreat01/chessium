"use client";

import { useState } from 'react';
import { Keyboard, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const shortcuts = [
  { key: '←', description: 'Previous move' },
  { key: '→', description: 'Next move' },
  { key: 'Home', description: 'First move' },
  { key: 'End', description: 'Last move' },
  { key: 'Space', description: 'Toggle auto-play' },
  { key: 'F', description: 'Flip board' },
  { key: 'H', description: 'Show hint' },
  { key: 'E', description: 'Toggle engine' },
  { key: 'S', description: 'Toggle sound' },
  { key: '?', description: 'Show shortcuts' },
];

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors text-gray-400 hover:text-gray-200"
        title="Keyboard Shortcuts (?)"
      >
        <Keyboard className="w-5 h-5" />
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
              className="glass-panel p-6 max-w-md w-full mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-lg">
                  <Keyboard className="w-5 h-5 text-[#0f1013]" />
                </div>
                <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
              </div>

              <div className="flex flex-col gap-2">
                {shortcuts.map((s, i) => (
                  <div key={i} className="flex justify-between items-center py-2 px-3 rounded-lg bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] transition-colors">
                    <span className="text-sm text-gray-300">{s.description}</span>
                    <kbd className="px-2.5 py-1 bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.15)] rounded-md text-xs font-mono text-green-400 shadow-sm min-w-[40px] text-center">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Press <kbd className="px-1.5 py-0.5 bg-[rgba(0,0,0,0.3)] rounded text-[10px] font-mono text-gray-400 border border-[rgba(255,255,255,0.1)]">?</kbd> anytime to open this panel
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
