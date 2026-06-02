"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCourse, getLesson } from "@/lib/chess/courses-db";
import { Chess } from "chess.js";
import Board from "@/components/chess/Board";
import { useSettings } from "@/contexts/SettingsContext";

export default function LessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const router = useRouter();
  const { courseId, lessonId } = React.use(params);
  const { settings } = useSettings();
  
  const course = getCourse(courseId);
  const lesson = getLesson(courseId, lessonId);

  const [stepIndex, setStepIndex] = useState(0);
  const [position, setPosition] = useState("start");
  const [status, setStatus] = useState<"playing" | "success" | "failed" | "completed">("playing");
  const [message, setMessage] = useState("");
  
  const chessRef = useRef(new Chess());

  // Helper to convert UCI (e.g. e2e4) to chess.js object
  const uciToObj = (uci: string) => ({
    from: uci.substring(0, 2),
    to: uci.substring(2, 4),
    promotion: uci[4] ? uci[4] : undefined
  });

  // Load the current step
  useEffect(() => {
    if (!lesson) return;
    
    if (stepIndex < lesson.steps.length) {
      const step = lesson.steps[stepIndex];
      const chess = new Chess(step.fen);
      chessRef.current = chess;
      setPosition(chess.fen());
      setStatus("playing");
      setMessage(step.instruction);
    } else {
      setStatus("completed");
      setMessage("Lesson Completed! Great job.");
      
      // We could mark it completed in localStorage or Supabase here
      const completed = JSON.parse(localStorage.getItem("chessium_completed_courses") || "[]");
      if (!completed.includes(courseId)) {
        completed.push(courseId);
        localStorage.setItem("chessium_completed_courses", JSON.stringify(completed));
      }
    }
  }, [lesson, stepIndex, courseId]);

  if (!course || !lesson) {
    return <div className="text-center p-12 text-[#a0a0a8]">Lesson not found.</div>;
  }

  const handlePieceDrop = (source: string, target: string, piece: string) => {
    if (status !== "playing" || stepIndex >= lesson.steps.length) return false;

    const step = lesson.steps[stepIndex];
    const promotion = piece[1].toLowerCase();
    const moveStr = source + target + (promotion === "p" ? "" : promotion);
    const chess = chessRef.current;

    // Is it the correct move?
    if (moveStr === step.expectedMove) {
      try {
        chess.move(uciToObj(moveStr));
        setPosition(chess.fen());
        setStatus("success");
        setMessage(step.successMessage);

        // If there's an opponent reply, schedule it
        if (step.opponentReply) {
          setTimeout(() => {
            try {
              chess.move(uciToObj(step.opponentReply as string));
              setPosition(chess.fen());
            } catch(e) {
              console.error("Opponent reply failed", e);
            }
          }, 600);
        }
      } catch (e) {
        console.error("Move failed", e);
      }
      return true;
    } else {
      // Test if it's a legal move at all
      try {
        const testMove = chess.move({
          from: source,
          to: target,
          promotion: promotion === "p" ? undefined : promotion,
        });
        
        if (testMove) {
          // Revert the move because it's the wrong answer
          chess.undo();
          setStatus("failed");
          setMessage(step.failMessage || "That's not the right move. Try again.");
          return false; // Snap back
        }
      } catch (e) {
        return false;
      }
      return false;
    }
  };

  const nextStep = () => {
    setStepIndex(prev => prev + 1);
  };

  const isBlackPOV = lesson.steps[stepIndex]?.fen.split(" ")[1] === "b";

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Top Header */}
      <div className="mb-6">
        <Link href={`/courses/${courseId}`} className="text-[#81b64c] hover:text-[#9fcc6b] text-sm font-medium mb-2 inline-block">
          ← Back to {course.title}
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{lesson.title}</h1>
          <span className="px-3 py-1 bg-[#141416] border border-[#2a2a30] text-[#a0a0a8] rounded-lg text-sm font-bold">
            Step {Math.min(stepIndex + 1, lesson.steps.length)} of {lesson.steps.length}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
        
        {/* Left Side: Board */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <div className="w-full max-w-[600px] mx-auto shadow-elevated rounded-xl overflow-hidden border border-[#2a2a30]">
            <Board 
              position={position}
              boardOrientation={isBlackPOV ? "black" : "white"}
              onPieceDrop={handlePieceDrop}
              arePiecesDraggable={status === "playing" || status === "failed"}
              theme={settings.boardTheme}
              animationDuration={settings.moveAnimation ? 200 : 0}
            />
          </div>
        </div>

        {/* Right Side: Dialogue Box */}
        <div className="w-full lg:w-[400px] flex flex-col gap-4">
          <div className="bg-[#141416] border border-[#2a2a30] rounded-2xl p-6 shadow-elevated flex-1 flex flex-col">
            
            {/* Coach avatar/icon */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#2a2a30]">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#81b64c] to-[#9fcc6b] flex items-center justify-center text-2xl shadow-lg">
                👨‍🏫
              </div>
              <div>
                <div className="font-bold text-white">Coach</div>
                <div className="text-xs text-[#a0a0a8]">Chessium Instructor</div>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto">
              <div className={`text-lg leading-relaxed transition-colors ${
                status === "success" || status === "completed" ? "text-[#81b64c] font-medium" :
                status === "failed" ? "text-[#ca3431] font-medium" :
                "text-white"
              }`}>
                {message}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 mt-auto">
              {status === "success" && (
                <button 
                  onClick={nextStep}
                  className="w-full bg-[#81b64c] hover:bg-[#9fcc6b] text-white py-3 rounded-xl font-bold transition-all shadow-elevated hover:-translate-y-0.5"
                >
                  Continue
                </button>
              )}
              
              {status === "completed" && (
                <button 
                  onClick={() => router.push(`/courses/${courseId}`)}
                  className="w-full bg-[#81b64c] hover:bg-[#9fcc6b] text-white py-3 rounded-xl font-bold transition-all shadow-elevated hover:-translate-y-0.5"
                >
                  Return to Course
                </button>
              )}
              
              {status === "failed" && (
                <button 
                  onClick={() => {
                    setStatus("playing");
                    setMessage(lesson.steps[stepIndex].instruction);
                  }}
                  className="w-full bg-[#2a2a30] hover:bg-[#3a3a42] text-white py-3 rounded-xl font-bold transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
