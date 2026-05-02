"use client";

import { useRef, useState } from 'react';
import { useChessStore } from '@/lib/chessStore';
import { X } from 'lucide-react';
import { toPng } from 'html-to-image';
import { motion } from 'framer-motion';

// Inline SVG knight path (same as Header) to avoid html-to-image issues with external refs
const KNIGHT_PATH_1 = "M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18";
const KNIGHT_PATH_2 = "M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10";

export default function GameSummaryCard({ onClose }: { onClose: () => void }) {
  const { analysisResult, game } = useChessStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  if (!analysisResult) return null;

  const downloadImage = async () => {
    if (!cardRef.current) return;
    setLoading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, quality: 1.0, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `chessium-review-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setLoading(false);
    }
  };

  const headers = game.header();
  const whitePlayer = headers.White || '?';
  const blackPlayer = headers.Black || '?';
  const result = headers.Result || '*';

  const avgAccuracy = Math.round((analysisResult.accuracy.white + analysisResult.accuracy.black) / 2);

  const stats = [
    { label: 'Brilliant', value: analysisResult.counts.white.brilliant + analysisResult.counts.black.brilliant, color: '#1cb0f6', emoji: '⚡' },
    { label: 'Great', value: analysisResult.counts.white.great + analysisResult.counts.black.great, color: '#5c8bb0', emoji: '★' },
    { label: 'Best', value: analysisResult.counts.white.best + analysisResult.counts.black.best, color: '#81b64c', emoji: '♛' },
    { label: 'Blunders', value: analysisResult.counts.white.blunder + analysisResult.counts.black.blunder, color: '#fa412d', emoji: '✕' },
  ];

  // Calculate the ring offset
  const ringRadius = 62;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (ringCircumference * avgAccuracy) / 100;

  // Accuracy color
  const accColor = avgAccuracy >= 90 ? '#d4af37' : avgAccuracy >= 75 ? '#4ade80' : avgAccuracy >= 50 ? '#fbbf24' : '#ef4444';

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative flex flex-col gap-4 max-w-lg w-full"
      >
        {/* The Card to Capture */}
        <div 
          ref={cardRef}
          style={{ 
            width: '100%', 
            aspectRatio: '4/5',
            background: 'linear-gradient(165deg, #111318 0%, #0a0b0f 40%, #0d0e13 100%)',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(212, 175, 55, 0.12)',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            position: 'relative',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(212,175,55,0.08)',
          }}
        >
          {/* Top gold accent line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)',
          }} />

          {/* Subtle background glow */}
          <div style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(212,175,55,0.06), transparent 70%)',
            borderRadius: '50%',
          }} />

          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              {/* Gold Knight Logo */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08))',
                border: '1px solid rgba(212,175,55,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(212,175,55,0.15)',
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" width="26" height="26">
                  <path d={KNIGHT_PATH_1} fill="#d4af37" />
                  <path d={KNIGHT_PATH_2} fill="#d4af37" />
                </svg>
              </div>
              <span style={{
                fontSize: '22px',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}>
                Chessium
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{ width: '24px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3))' }} />
              <span style={{
                fontSize: '9px',
                fontWeight: 800,
                color: 'rgba(212,175,55,0.6)',
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
              }}>
                Game Review
              </span>
              <div style={{ width: '24px', height: '1px', background: 'linear-gradient(90deg, rgba(212,175,55,0.3), transparent)' }} />
            </div>
          </div>

          {/* Players & Score */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.025)',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 900,
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'center',
              }}>
                {whitePlayer}
              </span>
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>WHITE</span>
            </div>
            <div style={{
              padding: '6px 14px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
                {result}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 900,
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'center',
              }}>
                {blackPlayer}
              </span>
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>BLACK</span>
            </div>
          </div>

          {/* Accuracy Ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 0' }}>
            <div style={{ position: 'relative', width: '140px', height: '140px' }}>
              {/* Glow behind ring */}
              <div style={{
                position: 'absolute',
                inset: '10px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${accColor}10, transparent 70%)`,
                filter: 'blur(12px)',
              }} />
              <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="70" cy="70" r={ringRadius}
                  fill="none" stroke="rgba(255,255,255,0.04)"
                  strokeWidth="7"
                />
                <circle
                  cx="70" cy="70" r={ringRadius}
                  fill="none" stroke={accColor}
                  strokeWidth="7"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 8px ${accColor}60)` }}
                />
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: '36px', fontWeight: 900, color: '#fff', lineHeight: 1, fontFamily: 'system-ui, sans-serif' }}>
                  {avgAccuracy}%
                </span>
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.35)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '4px' }}>
                  Accuracy
                </span>
              </div>
            </div>
          </div>

          {/* Key Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: 'auto' }}>
            {stats.map((stat) => (
              <div key={stat.label} style={{
                background: 'rgba(255,255,255,0.025)',
                borderRadius: '14px',
                padding: '14px 16px',
                border: '1px solid rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: `${stat.color}18`,
                  border: `1px solid ${stat.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  color: stat.color,
                  fontWeight: 900,
                }}>
                  {stat.emoji}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    {stat.label}
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 900, color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
                    {stat.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '8px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>
              Analyzed at
            </span>
            <span style={{ fontSize: '10px', color: 'rgba(212,175,55,0.6)', fontWeight: 700 }}>
              chessium.ai
            </span>
          </div>
        </div>

        {/* Action Buttons (Not Captured) */}
        <div className="flex gap-3">
          <button 
            onClick={downloadImage}
            disabled={loading}
            className="flex-1 h-12 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #d4af37, #c5a028)',
              color: '#0a0a0a',
              border: '1px solid rgba(212,175,55,0.3)',
              boxShadow: '0 4px 20px rgba(212,175,55,0.2)',
            }}
          >
            {loading ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : '↓'}
            Save Card
          </button>
          <button 
            onClick={onClose}
            className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center border border-white/10 transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
