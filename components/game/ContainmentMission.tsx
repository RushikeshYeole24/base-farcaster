'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Incident, PlayerStats, MissionResult, EnergyNode } from '@/lib/game/types';

interface ContainmentMissionProps {
  incident: Incident;
  playerStats: PlayerStats;
  onComplete: (result: MissionResult) => void;
}

export default function ContainmentMission({ incident, playerStats, onComplete }: ContainmentMissionProps) {
  const maxMoves = 8;
  const timeLimit = 45;
  const gridSize = 4;
  const correctCount = 6;

  const [nodes, setNodes] = useState<EnergyNode[]>([]);
  const [correctNodes, setCorrectNodes] = useState<number[]>([]);
  const [movesLeft, setMovesLeft] = useState(maxMoves);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    // Initialize grid
    const newNodes: EnergyNode[] = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
      newNodes.push({
        id: i,
        x: i % gridSize,
        y: Math.floor(i / gridSize),
        active: false,
        correct: false,
      });
    }

    // Select random correct nodes
    const correct: number[] = [];
    while (correct.length < correctCount) {
      const id = Math.floor(Math.random() * newNodes.length);
      if (!correct.includes(id)) {
        correct.push(id);
        newNodes[id].correct = true;
      }
    }

    setNodes(newNodes);
    setCorrectNodes(correct);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleComplete('failed');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleNodeClick = (nodeId: number) => {
    if (movesLeft <= 0) return;

    const node = nodes[nodeId];
    if (node.active) return;

    const newNodes = [...nodes];
    newNodes[nodeId].active = true;
    setNodes(newNodes);
    setMovesLeft(prev => prev - 1);
    setSelectedCount(prev => prev + 1);

    // Check if all correct nodes are selected
    const activeCorrect = newNodes.filter(n => n.active && n.correct).length;
    if (activeCorrect === correctCount) {
      handleComplete('clean');
    } else if (movesLeft <= 1) {
      handleComplete(activeCorrect >= correctCount * 0.5 ? 'partial' : 'failed');
    }
  };

  const handleComplete = (outcome: 'clean' | 'partial' | 'failed') => {
    const energyUsed = outcome === 'clean' ? 15 : outcome === 'partial' ? 25 : 35;
    const controlGained = outcome === 'clean' ? 10 : outcome === 'partial' ? 3 : -5;
    const alignmentChange = outcome === 'clean' ? 5 : outcome === 'failed' ? -10 : 0;

    const consequences = {
      clean: 'Rift successfully sealed. No civilian casualties. Bureau commends your precision.',
      partial: 'Rift contained but unstable. Minor energy leakage detected. Monitoring required.',
      failed: 'Containment failed. Rift expanded. Emergency protocols activated.',
    };

    onComplete({
      outcome,
      alignmentChange,
      energyUsed,
      controlGained,
      storyConsequence: consequences[outcome],
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 pt-32">
      <div className="max-w-md w-full">
        {/* Mission Header */}
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 mb-4">
          <h2 className="text-xl font-bold text-cyan-300 mb-2">Containment Protocol</h2>
          <p className="text-sm text-gray-300 mb-4">Tap the correct energy nodes to seal the rift</p>
          
          <div className="flex justify-between text-sm">
            <span>⏱️ Time: {timeLeft}s</span>
            <span>🎯 Moves: {movesLeft}</span>
          </div>
        </div>

        {/* Energy Grid */}
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 mb-4">
          <div className="grid grid-cols-4 gap-3">
            {nodes.map((node) => (
              <motion.button
                key={node.id}
                whileHover={{ scale: node.active ? 1 : 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNodeClick(node.id)}
                disabled={node.active || movesLeft <= 0}
                className={`aspect-square rounded-lg transition-all ${
                  node.active
                    ? node.correct
                      ? 'bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-500/50'
                      : 'bg-gradient-to-br from-red-400 to-rose-600 shadow-lg shadow-red-500/50'
                    : 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-cyan-600 hover:to-blue-700'
                }`}
              >
                {node.active && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-2xl"
                  >
                    {node.correct ? '✓' : '✗'}
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="text-center text-sm text-gray-400">
          Find {correctCount} correct nodes • {selectedCount}/{correctCount} found
        </div>
      </div>
    </div>
  );
}
