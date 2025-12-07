'use client';

import { motion } from 'framer-motion';

interface CharacterScore {
  id: string;
  name: string;
  emoji: string;
  missionsCompleted: number;
  totalScore: number;
  energy: number;
  control: number;
  alignment: number;
  lastPlayed: string;
}

interface DashboardProps {
  characterScores: CharacterScore[];
  onClose: () => void;
  onSelectCharacter?: (characterId: string) => void;
}

export default function Dashboard({ characterScores, onClose, onSelectCharacter }: DashboardProps) {
  const sortedScores = [...characterScores].sort((a, b) => b.totalScore - a.totalScore);
  const topScore = sortedScores[0]?.totalScore || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-500/50 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              📊 Character Dashboard
            </h2>
            <p className="text-purple-200 mt-2">Track your magical journey</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-3xl text-purple-300 hover:text-white transition-colors"
          >
            ✕
          </motion.button>
        </div>

        {characterScores.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <p className="text-xl text-purple-300">No characters played yet</p>
            <p className="text-purple-400 mt-2">Start your magical adventure!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedScores.map((character, index) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={() => onSelectCharacter?.(character.id)}
                className={`relative bg-gradient-to-r ${
                  index === 0
                    ? 'from-yellow-900/50 to-amber-900/50 border-yellow-500/50'
                    : index === 1
                    ? 'from-gray-700/50 to-slate-700/50 border-gray-400/50'
                    : index === 2
                    ? 'from-orange-900/50 to-amber-800/50 border-orange-600/50'
                    : 'from-purple-900/30 to-indigo-900/30 border-purple-500/30'
                } backdrop-blur-sm p-6 rounded-2xl border-2 transition-all cursor-pointer`}
              >
                {/* Rank Badge */}
                {index < 3 && (
                  <div className="absolute -top-3 -left-3 text-4xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                )}

                <div className="flex items-center gap-6">
                  {/* Character Avatar */}
                  <div className="text-6xl">{character.emoji}</div>

                  {/* Character Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-white">{character.name}</h3>
                      <span className="text-sm text-purple-300">#{index + 1}</span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="bg-black/30 rounded-lg p-2">
                        <div className="text-xs text-purple-300">Missions</div>
                        <div className="text-lg font-bold text-emerald-400">
                          {character.missionsCompleted}
                        </div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-2">
                        <div className="text-xs text-purple-300">Score</div>
                        <div className="text-lg font-bold text-yellow-400">
                          {character.totalScore}
                        </div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-2">
                        <div className="text-xs text-purple-300">Control</div>
                        <div className="text-lg font-bold text-blue-400">
                          {character.control}%
                        </div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-2">
                        <div className="text-xs text-purple-300">Energy</div>
                        <div className="text-lg font-bold text-pink-400">
                          {character.energy}%
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-purple-300 mb-1">
                        <span>Progress</span>
                        <span>{Math.round((character.totalScore / topScore) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(character.totalScore / topScore) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        />
                      </div>
                    </div>

                    {/* Last Played */}
                    <div className="text-xs text-purple-400">
                      Last played: {character.lastPlayed}
                    </div>
                  </div>

                  {/* Alignment Indicator */}
                  <div className="hidden md:block text-center">
                    <div className="text-xs text-purple-300 mb-1">Alignment</div>
                    <div
                      className={`text-2xl ${
                        character.alignment > 30
                          ? 'text-blue-400'
                          : character.alignment < -30
                          ? 'text-red-400'
                          : 'text-purple-400'
                      }`}
                    >
                      {character.alignment > 30 ? '😇' : character.alignment < -30 ? '😈' : '😐'}
                    </div>
                    <div className="text-sm font-bold">
                      {character.alignment > 0 ? '+' : ''}
                      {character.alignment}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {characterScores.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bg-gradient-to-br from-purple-800/50 to-pink-800/50 p-4 rounded-xl text-center">
              <div className="text-3xl mb-2">🎭</div>
              <div className="text-2xl font-bold text-white">{characterScores.length}</div>
              <div className="text-sm text-purple-200">Characters</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-800/50 to-teal-800/50 p-4 rounded-xl text-center">
              <div className="text-3xl mb-2">⚔️</div>
              <div className="text-2xl font-bold text-white">
                {characterScores.reduce((sum, c) => sum + c.missionsCompleted, 0)}
              </div>
              <div className="text-sm text-emerald-200">Total Missions</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-800/50 to-amber-800/50 p-4 rounded-xl text-center">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-white">
                {characterScores.reduce((sum, c) => sum + c.totalScore, 0)}
              </div>
              <div className="text-sm text-yellow-200">Total Score</div>
            </div>
            <div className="bg-gradient-to-br from-blue-800/50 to-cyan-800/50 p-4 rounded-xl text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-white">{sortedScores[0]?.name || '-'}</div>
              <div className="text-sm text-blue-200">Top Player</div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
