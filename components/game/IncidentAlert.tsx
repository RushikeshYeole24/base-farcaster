'use client';

import { motion } from 'framer-motion';
import type { Incident } from '@/lib/game/types';

interface IncidentAlertProps {
  incident: Incident;
  onAccept: () => void;
}

export default function IncidentAlert({ incident, onAccept }: IncidentAlertProps) {
  const urgencyColor = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-red-400',
  }[incident.urgency];

  const urgencyBg = {
    low: 'bg-green-500/20',
    medium: 'bg-yellow-500/20',
    high: 'bg-red-500/20',
  }[incident.urgency];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="flex items-center justify-center min-h-screen p-4 pt-32"
    >
      <div className="max-w-md w-full">
        {/* Alert Header */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className={`${urgencyBg} border-2 ${urgencyColor.replace('text-', 'border-')} rounded-lg p-4 mb-4`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-gray-400">{incident.id}</span>
            <span className={`text-xs font-bold uppercase ${urgencyColor}`}>
              {incident.urgency} Priority
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-2">🚨 Incident Alert</h2>
          <p className="text-sm text-gray-300">Bureau Field Initiate - Respond Immediately</p>
        </motion.div>

        {/* Incident Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-black/40 backdrop-blur-sm rounded-lg p-6 mb-6 space-y-4"
        >
          <div>
            <h3 className="text-xl font-bold text-cyan-300 mb-2">{incident.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{incident.description}</p>
          </div>

          <div className="border-t border-gray-700 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Location:</span>
              <span className="text-white font-medium">{incident.location}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Mission Type:</span>
              <span className="text-cyan-300 font-medium uppercase">{incident.type}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Difficulty:</span>
              <span className="text-yellow-300">{'⭐'.repeat(incident.difficulty)}</span>
            </div>
          </div>
        </motion.div>

        {/* Accept Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAccept}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-shadow"
        >
          Accept Mission
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-gray-500 mt-4"
        >
          Session Length: 2-4 minutes
        </motion.p>
      </div>
    </motion.div>
  );
}
