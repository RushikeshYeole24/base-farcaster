"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Incident, PlayerStats, MissionResult } from "@/lib/game/types";

interface InvestigationMissionProps {
  incident: Incident;
  playerStats: PlayerStats;
  onComplete: (result: MissionResult) => void;
}

interface Point {
  x: number;
  y: number;
}

interface Rope {
  id: number;
  startPillar: number;
  endPillar: number;
  color: string;
}

// Puzzle configuration - 4 ropes need to connect from left to right without crossing
const CORRECT_SOLUTION = [
  { startPillar: 0, endPillar: 0 },
  { startPillar: 1, endPillar: 1 },
  { startPillar: 2, endPillar: 2 },
  { startPillar: 3, endPillar: 3 },
];

const ROPE_COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"];

export default function InvestigationMission({
  incident,
  playerStats,
  onComplete,
}: InvestigationMissionProps) {
  const [ropes, setRopes] = useState<Rope[]>([]);
  const [currentRope, setCurrentRope] = useState<{
    startPillar: number;
    currentPos: Point;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [attempts, setAttempts] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleComplete(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const checkSolution = () => {
    if (ropes.length !== 4) return false;

    // Check if all ropes are connected correctly
    const sortedRopes = [...ropes].sort(
      (a, b) => a.startPillar - b.startPillar
    );

    for (let i = 0; i < CORRECT_SOLUTION.length; i++) {
      if (
        sortedRopes[i].startPillar !== CORRECT_SOLUTION[i].startPillar ||
        sortedRopes[i].endPillar !== CORRECT_SOLUTION[i].endPillar
      ) {
        return false;
      }
    }

    return true;
  };

  const handleStartRope = (pillarIndex: number) => {
    if (ropes.length >= 4) return;
    if (ropes.some((r) => r.startPillar === pillarIndex)) return; // Already used

    setCurrentRope({
      startPillar: pillarIndex,
      currentPos: { x: 0, y: 0 },
    });
  };

  const handleEndRope = (pillarIndex: number) => {
    if (!currentRope) return;
    if (ropes.some((r) => r.endPillar === pillarIndex)) return; // Already used

    const newRope: Rope = {
      id: Date.now(),
      startPillar: currentRope.startPillar,
      endPillar: pillarIndex,
      color: ROPE_COLORS[ropes.length],
    };

    const newRopes = [...ropes, newRope];
    setRopes(newRopes);
    setCurrentRope(null);

    // Check if puzzle is complete
    if (newRopes.length === 4) {
      setTimeout(() => {
        const isCorrect = checkSolution();
        handleComplete(isCorrect);
      }, 500);
    }
  };

  const handleComplete = (success: boolean) => {
    const outcome: "clean" | "partial" | "failed" = success
      ? "clean"
      : attempts > 0
      ? "partial"
      : "failed";
    const energyUsed = success ? 15 : 25;
    const controlGained = success ? 15 : attempts > 0 ? 5 : -5;
    const alignmentChange = success ? 5 : -3;

    onComplete({
      outcome,
      alignmentChange,
      energyUsed,
      controlGained,
      storyConsequence: success
        ? "Magical ropes connected perfectly! The portal stabilized and the threat was contained."
        : attempts > 0
        ? "Ropes connected incorrectly. Portal partially stabilized but energy leaked."
        : "Failed to connect the ropes in time. The portal collapsed chaotically.",
    });
  };

  const handleReset = () => {
    setRopes([]);
    setCurrentRope(null);
    setAttempts((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 pt-32">
      <div className="max-w-2xl w-full">
        {/* Mission Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-900/80 to-orange-900/80 backdrop-blur-sm rounded-lg p-4 mb-6 border-2 border-amber-500/50"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-amber-300 mb-1">
                🏰 IQ Dungeon Level 117
              </h2>
              <p className="text-sm text-amber-100">
                Connect 4 Ropes Without Crossing
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{timeLeft}s</div>
              <div className="text-xs text-amber-200">Time Left</div>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-black/60 backdrop-blur-sm rounded-lg p-4 mb-6 border border-purple-500/30"
        >
          <p className="text-center text-purple-200">
            🪢 Connect each rope from the{" "}
            <span className="text-amber-400 font-bold">left pillar</span> to the{" "}
            <span className="text-cyan-400 font-bold">right pillar</span> at the
            top
          </p>
          <p className="text-center text-sm text-gray-400 mt-2">
            Ropes must not cross each other! ({ropes.length}/4 connected)
          </p>
        </motion.div>

        {/* Puzzle Area */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          ref={canvasRef}
          className="relative bg-gradient-to-br from-slate-800/90 to-purple-900/90 backdrop-blur-md rounded-2xl p-8 border-2 border-amber-500/50 shadow-2xl"
          style={{ minHeight: "400px" }}
        >
          {/* Left Pillars */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-8">
            {[0, 1, 2, 3].map((index) => (
              <motion.button
                key={`left-${index}`}
                onClick={() => handleStartRope(index)}
                disabled={
                  ropes.some((r) => r.startPillar === index) ||
                  currentRope !== null
                }
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-12 h-12 rounded-full border-4 transition-all ${
                  ropes.some((r) => r.startPillar === index)
                    ? "bg-green-600 border-green-400 cursor-not-allowed"
                    : currentRope?.startPillar === index
                    ? "bg-yellow-600 border-yellow-400 animate-pulse"
                    : "bg-amber-600 border-amber-400 hover:bg-amber-500"
                }`}
              >
                <span className="text-2xl">🔗</span>
              </motion.button>
            ))}
          </div>

          {/* Right Pillars */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-8">
            {[0, 1, 2, 3].map((index) => (
              <motion.button
                key={`right-${index}`}
                onClick={() => handleEndRope(index)}
                disabled={
                  ropes.some((r) => r.endPillar === index) ||
                  currentRope === null
                }
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-12 h-12 rounded-full border-4 transition-all ${
                  ropes.some((r) => r.endPillar === index)
                    ? "bg-green-600 border-green-400 cursor-not-allowed"
                    : currentRope !== null
                    ? "bg-cyan-600 border-cyan-400 hover:bg-cyan-500"
                    : "bg-slate-600 border-slate-400 cursor-not-allowed"
                }`}
              >
                <span className="text-2xl">🎯</span>
              </motion.button>
            ))}
          </div>

          {/* Ropes SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <AnimatePresence>
              {ropes.map((rope, idx) => {
                const startY = 50 + rope.startPillar * 100;
                const endY = 50 + rope.endPillar * 100;

                return (
                  <motion.path
                    key={rope.id}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    d={`M 80 ${startY} Q ${
                      canvasRef.current?.offsetWidth
                        ? canvasRef.current.offsetWidth / 2
                        : 300
                    } ${(startY + endY) / 2}, ${
                      (canvasRef.current?.offsetWidth || 600) - 80
                    } ${endY}`}
                    stroke={rope.color}
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                );
              })}
            </AnimatePresence>
          </svg>

          {/* Center instruction */}
          {ropes.length === 0 && !currentRope && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🪢</div>
                <p className="text-xl text-purple-200">
                  Click a left pillar to start
                </p>
              </div>
            </motion.div>
          )}

          {currentRope && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="text-center">
                <div className="text-4xl mb-2">→</div>
                <p className="text-lg text-yellow-300">
                  Now click a right pillar
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Reset Button */}
        {ropes.length > 0 && ropes.length < 4 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="mt-4 w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 px-6 rounded-lg font-bold hover:from-red-500 hover:to-rose-500 transition-all"
          >
            🔄 Reset Ropes
          </motion.button>
        )}

        {/* Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center text-sm text-gray-400"
        >
          💡 Hint: Connect straight across - top to top, bottom to bottom
        </motion.div>
      </div>
    </div>
  );
}
