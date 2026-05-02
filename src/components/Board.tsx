"use client";

import { useMemo, useState, useEffect, useRef } from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { useChessStore, BOARD_THEMES } from '@/lib/chessStore';
import { useUserStore } from '@/lib/userStore';
import { Palette, Lightbulb, BookOpen, Star, ThumbsUp, Check, X, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Board() {
  return <div className="bg-red-500 p-20">BUILD TEST</div>;
}
