'use client';

import { motion } from 'framer-motion';
import type { MissionResult, Incident, PlayerStats } from '@/lib/game/types';
import { getAlignmentLabel } from '@/lib/game/stats';

interface MissionResultProps {
  result: MissionResult;
  incident: Incident;
  newStats: PlayerStats;
  onNext: () => void;
}

export default function MissionResult({ result, incident, newStats, onNext }: MissionResultProps) {
  const outcomeConfig = {
    clean: {
      title: '✅ Mission Success',
      color: 'from-green-400 to-emerald-600',
      bg: 'bg-green-500/20',
      border: 'border-green-400',
    },
    partial: {
      title: '⚠️ Partial Success',
      color: 'from-yellow-400 to-orange-600',
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-400',
    },
    failed: {
      title: '❌ Mission Failed',
      color: 'from-red-400 to-rose-600',
      bg: 'bg-red-500/20',
      border: 'border-red-400',
    },
  }[result.outcome];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center justify-center min-h-screen p-4 pt-32"
    >
      <div className="max-w-md w-full">
        {/* Outcome Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${outcomeConfig.bg} border-2 ${outcomeConfig.border} rounded-lg p-6 mb-4 text-center`}
        >
          <motion.h2
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className={`text-3xl font-bold mb-2 bg-gradient-to-r ${outcomeConfig.color} bg-clip-text text-transparent`}
          >
            {outcomeConfig.title}
          </motion.h2>
          <p className="text-sm text-gray-400">{incident.id} • {incident.type.toUpperCase()}</p>
        </motion.div>

        {/* Story Consequence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-black/60 backdrop-blur-sm rounded-lg p-6 mb-4"
        >
          <h3 className="text-lg font-bold text-cyan-300 mb-3">Mission Report</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {result.storyConsequence}
          </p>

          <div className="border-t border-gray-700 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Energy Used:</span>
              <span className="text-cyan-300">-{result.energyUsed} ⚡</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Control Change:</span>
              <span className={result.controlGained >= 0 ? 'text-green-400' : 'text-red-400'}>
                {result.controlGained >= 0 ? '+' : ''}{result.controlGained} 🧠
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Alignment Shift:</span>
              <span className={result.alignmentChange >= 0 ? 'text-yellow-400' : 'text-purple-400'}>
                {result.alignmentChange >= 0 ? '+' : ''}{result.alignmentChange} ⚖️
              </span>
            </div>
          </div>
        </motion.div>

        {/* Updated Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-black/60 backdrop-blur-sm rounded-lg p-6 mb-4"
        >
          <h3 className="text-lg font-bold text-cyan-300 mb-3">Updated Status</h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>✨ Energy</span>
                <span>{newStats.energy}/100</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${newStats.energy}%` }}
                  transition={{ delay: 1, duration: 0.5 }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>🧠 Control</span>
                <span>{newStats.control}/100</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${newStats.control}%` }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>⚖️ Alignment</span>
                <span className={newStats.alignment > 20 ? 'text-yellow-300' : newStats.alignment < -20 ? 'text-purple-400' : 'text-gray-300'}>
                  {getAlignmentLabel(newStats.alignment)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SBT Minted Notice */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
          className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400 rounded-lg p-4 mb-4 text-center"
        >
          <p className="text-sm text-purple-300 mb-1">🏅 Soulbound Token Minted</p>
          <p className="text-xs text-gray-400">Mission record permanently stored on-chain</p>
        </motion.div>

        {/* Next Mission Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-shadow"
        >
          Next Incident →
        </motion.button>
      </div>
    </motion.div>
  );
}
