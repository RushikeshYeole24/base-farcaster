'use client';

import { motion } from 'framer-motion';
import type { PlayerStats } from '@/lib/game/types';
import { getAlignmentLabel } from '@/lib/game/stats';

interface PlayerStatsProps {
  stats: PlayerStats;
  sbtsMinted: number;
}

export default function PlayerStats({ stats, sbtsMinted }: PlayerStatsProps) {
  const alignmentLabel = getAlignmentLabel(stats.alignment);
  const alignmentColor = stats.alignment > 20 ? 'text-yellow-300' : stats.alignment < -20 ? 'text-purple-400' : 'text-gray-300';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-sm p-4">
      <div className="max-w-md mx-auto space-y-2">
        {/* Energy */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>✨ Energy</span>
            <span>{stats.energy}/100</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${stats.energy}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Control */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>🧠 Control</span>
            <span>{stats.control}/100</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${stats.control}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Alignment */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>⚖️ Alignment</span>
            <span className={alignmentColor}>{alignmentLabel}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 flex">
              <div className="w-1/2 bg-gradient-to-r from-purple-600 to-purple-400" />
              <div className="w-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600" />
            </div>
            <motion.div
              className="absolute top-0 h-full w-1 bg-white shadow-lg"
              initial={{ left: '50%' }}
              animate={{ left: `${50 + (stats.alignment / 2)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* SBTs Minted */}
        <div className="text-center text-xs text-gray-400 pt-1">
          🏅 Missions Completed: {sbtsMinted}
        </div>
      </div>
    </div>
  );
}
