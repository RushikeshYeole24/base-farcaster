'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Incident, PlayerStats, MissionResult, Enemy, SpellType } from '@/lib/game/types';
import { getRandomEnemy } from '@/lib/game/missions';

interface InterceptionMissionProps {
  incident: Incident;
  playerStats: PlayerStats;
  onComplete: (result: MissionResult) => void;
}

export default function InterceptionMission({ incident, playerStats, onComplete }: InterceptionMissionProps) {
  const [enemy, setEnemy] = useState<Enemy | null>(null);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [playerEnergy, setPlayerEnergy] = useState(100);
  const [shieldActive, setShieldActive] = useState(false);
  const [enemyBound, setEnemyBound] = useState(false);
  const [turn, setTurn] = useState(1);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  useEffect(() => {
    setEnemy(getRandomEnemy());
  }, []);

  const addLog = (message: string) => {
    setCombatLog(prev => [...prev.slice(-3), message]);
  };

  const handleSpell = (spell: SpellType) => {
    if (!enemy || !isPlayerTurn) return;

    let energyCost = 0;
    let damage = 0;

    switch (spell) {
      case 'attack':
        energyCost = 20;
        damage = spell === enemy.weakness ? 40 : 25;
        setEnemy({ ...enemy, health: Math.max(0, enemy.health - damage) });
        addLog(`⚔️ You cast Attack! Dealt ${damage} damage.`);
        break;
      
      case 'shield':
        energyCost = 15;
        setShieldActive(true);
        addLog('🛡️ Shield activated! Next attack blocked.');
        break;
      
      case 'bind':
        energyCost = 25;
        setEnemyBound(true);
        if (spell === enemy.weakness) {
          damage = 20;
          setEnemy({ ...enemy, health: Math.max(0, enemy.health - damage) });
          addLog(`⛓️ Bind spell! Enemy immobilized and took ${damage} damage.`);
        } else {
          addLog('⛓️ Enemy bound for 1 turn!');
        }
        break;
      
      case 'drain':
        energyCost = 30;
        damage = spell === enemy.weakness ? 35 : 20;
        const healed = Math.floor(damage * 0.5);
        setEnemy({ ...enemy, health: Math.max(0, enemy.health - damage) });
        setPlayerHealth(prev => Math.min(100, prev + healed));
        addLog(`🌀 Drain spell! Dealt ${damage} damage, healed ${healed} HP.`);
        break;
    }

    setPlayerEnergy(prev => Math.max(0, prev - energyCost));
    setIsPlayerTurn(false);

    // Check if enemy defeated
    if (enemy.health - damage <= 0) {
      setTimeout(() => handleVictory(), 1000);
      return;
    }

    // Enemy turn
    setTimeout(() => enemyTurn(), 1500);
  };

  const enemyTurn = () => {
    if (!enemy) return;

    if (enemyBound) {
      addLog('⛓️ Enemy is bound and cannot act!');
      setEnemyBound(false);
      setIsPlayerTurn(true);
      setTurn(prev => prev + 1);
      return;
    }

    const enemyDamage = 20 + Math.floor(Math.random() * 10);

    if (shieldActive) {
      addLog('🛡️ Shield blocked the attack!');
      setShieldActive(false);
    } else {
      setPlayerHealth(prev => Math.max(0, prev - enemyDamage));
      addLog(`💥 ${enemy.name} used ${enemy.nextMove}! Took ${enemyDamage} damage.`);
    }

    // Check if player defeated
    if (playerHealth - enemyDamage <= 0) {
      setTimeout(() => handleDefeat(), 1000);
      return;
    }

    setIsPlayerTurn(true);
    setTurn(prev => prev + 1);
  };

  const handleVictory = () => {
    const energyUsed = 100 - playerEnergy;
    onComplete({
      outcome: 'clean',
      alignmentChange: 3,
      energyUsed,
      controlGained: 10,
      storyConsequence: `${enemy?.name} neutralized. Threat eliminated. Area secured.`,
    });
  };

  const handleDefeat = () => {
    onComplete({
      outcome: 'failed',
      alignmentChange: -8,
      energyUsed: 40,
      controlGained: -5,
      storyConsequence: 'Defeated in combat. Emergency extraction initiated. Shadow influence grows.',
    });
  };

  if (!enemy) return null;

  const spells: { type: SpellType; name: string; cost: number; icon: string }[] = [
    { type: 'attack', name: 'Attack', cost: 20, icon: '⚔️' },
    { type: 'shield', name: 'Shield', cost: 15, icon: '🛡️' },
    { type: 'bind', name: 'Bind', cost: 25, icon: '⛓️' },
    { type: 'drain', name: 'Drain', cost: 30, icon: '🌀' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 pt-32">
      <div className="max-w-md w-full">
        {/* Mission Header */}
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 mb-4">
          <h2 className="text-xl font-bold text-cyan-300 mb-2">Interception Protocol</h2>
          <p className="text-sm text-gray-300">Turn {turn} • {isPlayerTurn ? 'Your Turn' : 'Enemy Turn'}</p>
        </div>

        {/* Enemy Status */}
        <motion.div
          animate={{ scale: isPlayerTurn ? 1 : [1, 1.05, 1] }}
          className="bg-gradient-to-br from-red-900/40 to-purple-900/40 backdrop-blur-sm rounded-lg p-4 mb-4"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-red-300">{enemy.name}</h3>
            <span className="text-sm text-gray-400">💀 {enemy.health}/{enemy.maxHealth}</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 to-rose-600"
              initial={{ width: '100%' }}
              animate={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">Next: {enemy.nextMove}</p>
          {enemyBound && <p className="text-xs text-yellow-300 mt-1">⛓️ Bound</p>}
        </motion.div>

        {/* Player Status */}
        <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-sm rounded-lg p-4 mb-4">
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>❤️ Health</span>
                <span>{playerHealth}/100</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                  animate={{ width: `${playerHealth}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>⚡ Energy</span>
                <span>{playerEnergy}/100</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-600"
                  animate={{ width: `${playerEnergy}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
          {shieldActive && <p className="text-xs text-cyan-300 mt-2">🛡️ Shield Active</p>}
        </div>

        {/* Combat Log */}
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 mb-4 h-24 overflow-y-auto">
          <AnimatePresence>
            {combatLog.map((log, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-gray-300 mb-1"
              >
                {log}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>

        {/* Spell Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {spells.map((spell) => (
            <motion.button
              key={spell.type}
              whileHover={{ scale: isPlayerTurn && playerEnergy >= spell.cost ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSpell(spell.type)}
              disabled={!isPlayerTurn || playerEnergy < spell.cost}
              className={`py-4 px-4 rounded-lg font-bold transition-all ${
                playerEnergy >= spell.cost && isPlayerTurn
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              } ${spell.type === enemy.weakness ? 'ring-2 ring-yellow-400' : ''}`}
            >
              <div className="text-2xl mb-1">{spell.icon}</div>
              <div className="text-sm">{spell.name}</div>
              <div className="text-xs text-gray-300">-{spell.cost} ⚡</div>
            </motion.button>
          ))}
        </div>

        <p className="text-center text-xs text-yellow-300 mt-3">
          💡 Enemy weakness: {enemy.weakness}
        </p>
      </div>
    </div>
  );
}
