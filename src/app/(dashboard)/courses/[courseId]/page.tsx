"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import Link from 'next/link';
import Board from '@/components/chess/Board';
import AdSlot from '@/components/ui/AdSlot';
import { useCourseProgress } from '@/hooks/useCourseProgress';

// Theory Content Data
const COURSE_CONTENT: Record<string, any> = {
  "beginner-basics": {
    title: "Chess Fundamentals",
    color: "#81b64c",
    theory: [
      "Welcome to Chess Fundamentals! In this lesson, we will cover the absolute basics of the game.",
      "The chess board consists of 64 squares, alternating between light and dark colors. The board is always set up so that each player has a light square on their bottom-right corner.",
      "The most important piece on the board is the King. If your King is attacked and cannot escape, it's Checkmate and you lose the game!",
      "Below is the starting position of a chess game. The White pieces are set up on the 1st and 2nd ranks, while the Black pieces are on the 7th and 8th ranks."
    ],
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  },
  "tactics-101": {
    title: "Tactics 101: Pins, Forks & Skewers",
    color: "#f7c631",
    theory: [
      "Tactics are the heart of chess! A tactic is a forced sequence of moves that results in a tangible advantage.",
      "A **Fork** occurs when a single piece attacks two or more enemy pieces at the same time. Knights are particularly famous for their deadly forks.",
      "A **Pin** happens when an attacked piece cannot move without exposing a more valuable piece behind it to capture.",
      "A **Skewer** is similar to a pin, but reversed: the more valuable piece is attacked first, and when it moves away, the lesser piece behind it is captured.",
      "Look at the board below. The White Knight on c7 is forking the Black King on e8 and the Black Rook on a8! This is a classic Royal Fork."
    ],
    fen: "r3k2r/ppN1pppp/8/8/8/8/PPPPPPPP/R3K2R b KQkq - 0 1"
  },
  "endgame-mastery": {
    title: "Endgame Mastery",
    color: "#5c8bb0",
    theory: [
      "The endgame is the phase of the game where most pieces have been traded off.",
      "The most fundamental endgame is King and Pawn vs King. If the defending King can get in front of the pawn and take the 'Opposition', it is usually a draw.",
      "**The Opposition** is a key concept where Kings face each other with one square between them. The player who does *not* have to move has the opposition.",
      "In the position below, White to move wins by outflanking the Black King!"
    ],
    fen: "8/8/8/8/8/4k3/4P3/4K3 w - - 0 1"
  },
  "ruy-lopez": {
    title: "The Ruy Lopez",
    color: "#1baca6",
    theory: [
      "The Ruy Lopez (or Spanish Game) is one of the oldest and most classic chess openings, starting with 1.e4 e5 2.Nf3 Nc6 3.Bb5.",
      "White's 3rd move (Bb5) puts pressure on the c6 Knight, which defends the e5 pawn. White's goal is to control the center, castle quickly, and build long-term positional pressure.",
      "Black has many defenses, but the most popular are the Morphy Defense (3...a6) and the Berlin Defense (3...Nf6).",
      "Below is the starting position of the Ruy Lopez after 3.Bb5."
    ],
    fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3"
  }
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const { isCompleted, markCompleted } = useCourseProgress();
  const [completed, setCompleted] = useState(isCompleted(courseId));

  const course = COURSE_CONTENT[courseId];

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-6">
        <h1 className="text-4xl font-bold text-white">Course Coming Soon!</h1>
        <p className="text-text-secondary text-lg">
          We are currently writing the interactive theory for this course. Please check back later!
        </p>
        <Link href="/courses" className="inline-block mt-8 bg-accent text-white px-6 py-3 rounded-xl font-bold hover:bg-accent-hover transition-colors">
          Back to Courses
        </Link>
      </div>
    );
  }

  const handleComplete = () => {
    markCompleted(courseId);
    setCompleted(true);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Back Button */}
      <Link href="/courses" className="inline-flex items-center gap-2 text-text-secondary hover:text-white mb-8 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Courses
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: course.color }}>
            {course.title[0]}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{course.title}</h1>
        </div>
        {completed && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-semibold border border-accent/30">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Course Completed
          </div>
        )}
      </div>

      <div className="bg-bg-secondary border border-border rounded-2xl p-6 md:p-10 mb-8">
        <div className="prose prose-invert prose-lg max-w-none mb-10">
          {course.theory.map((paragraph: string, idx: number) => (
            <p key={idx} className="text-text-secondary leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
          ))}
        </div>

        {/* Interactive Board Diagram */}
        <div className="bg-bg-tertiary rounded-xl p-4 md:p-8 flex justify-center border border-border/50">
          <div className="w-full max-w-[400px]">
            <Board position={course.fen} onPieceDrop={() => false} />
          </div>
        </div>
        <p className="text-center text-sm text-text-tertiary mt-4">Interactive Diagram — Try moving the pieces!</p>
      </div>

      <div className="mb-8">
        <AdSlot slot="course-content-bottom" />
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end">
        {!completed ? (
          <button 
            onClick={handleComplete}
            className="bg-accent text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent-hover transition-colors shadow-lg hover:shadow-accent/20 flex items-center gap-2"
          >
            Mark as Completed
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        ) : (
          <Link 
            href="/courses"
            className="bg-[#2a2a30] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#3a3a42] transition-colors"
          >
            Return to Library
          </Link>
        )}
      </div>
    </div>
  );
}
