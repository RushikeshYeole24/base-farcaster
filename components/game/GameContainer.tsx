"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  GameState,
  Incident,
  MissionResult as MissionResultType,
} from "@/lib/game/types";
import { INITIAL_STATS } from "@/lib/game/stats";
import { getRandomIncident } from "@/lib/game/missions";
import IncidentAlert from "./IncidentAlert";
import ContainmentMission from "./ContainmentMission";
import InvestigationMission from "./InvestigationMission";
import InterceptionMission from "./InterceptionMission";
import RuneLockMission from "./RuneLockMission";
import MissionResult from "./MissionResult";
import PlayerStats from "./PlayerStats";
import Dashboard from "./Dashboard";

type GamePhase = "entrance" | "character-select" | "dashboard" | "alert" | "mission" | "result";

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

const CHARACTERS = [
  { id: "kyra", name: "Kyra", emoji: "🧙‍♀️", description: "Elf with powerful magic" },
  { id: "imogen", name: "Imogen", emoji: "✨", description: "Fairy with light magic" },
  { id: "lily", name: "Lily", emoji: "🌟", description: "Human with hidden potential" },
  { id: "ruksy", name: "Ruksy", emoji: "📚", description: "Magical scholar" },
  { id: "darra", name: "Darra", emoji: "🔮", description: "Elf with elemental powers" },
  { id: "peter", name: "Peter", emoji: "⚡", description: "Human with courage" },
];

export default function GameContainer() {
  const [gameState, setGameState] = useState<GameState>({
    currentIncident: null,
    playerStats: INITIAL_STATS,
    missionInProgress: false,
    missionType: null,
    sbtsMinted: 0,
  });

  const [phase, setPhase] = useState<GamePhase>("entrance");
  const [missionResult, setMissionResult] = useState<MissionResultType | null>(
    null
  );
  const [characterScores, setCharacterScores] = useState<CharacterScore[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<CharacterScore | null>(null);
  const [isFirstMission, setIsFirstMission] = useState(true);

  useEffect(() => {
    // Load character scores from localStorage
    const saved = localStorage.getItem('bureauCharacterScores');
    if (saved) {
      setCharacterScores(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Generate first incident only after avatar selection
    if (phase === "alert" && !gameState.currentIncident) {
      startNewIncident();
    }
  }, [phase]);

  useEffect(() => {
    // Save character scores to localStorage
    if (characterScores.length > 0) {
      localStorage.setItem('bureauCharacterScores', JSON.stringify(characterScores));
    }
  }, [characterScores]);

  const startNewIncident = () => {
    let incident: {
      id: string;
      type: 'containment' | 'investigation' | 'interception' | 'runelock';
      title: string;
      description: string;
      location: string;
      urgency: 'low' | 'medium' | 'high';
      difficulty: number;
    };
    
    // First mission is always RuneLock
    if (isFirstMission) {
      incident = {
        id: 'INC-FIRST',
        type: 'runelock',
        title: 'Ancient Rune Chamber',
        description: 'A sealed rune chamber has been discovered. Solve the puzzle and defeat the guardian to unlock its secrets.',
        location: 'Underground Catacombs',
        urgency: 'medium',
        difficulty: 2,
      };
      setIsFirstMission(false);
    } else {
      // After first mission, get random missions
      incident = getRandomIncident();
    }
    
    setGameState((prev) => ({
      ...prev,
      currentIncident: incident,
      missionType: incident.type,
      missionInProgress: false,
    }));
    setPhase("alert");
  };

  const handleAcceptMission = () => {
    setGameState((prev) => ({ ...prev, missionInProgress: true }));
    setPhase("mission");
  };

  const handleMissionComplete = (result: MissionResultType) => {
    setMissionResult(result);
    const newStats = {
      energy: Math.max(0, gameState.playerStats.energy - result.energyUsed),
      control: Math.min(100, gameState.playerStats.control + result.controlGained),
      alignment: Math.max(
        -100,
        Math.min(100, gameState.playerStats.alignment + result.alignmentChange)
      ),
    };
    
    setGameState((prev) => ({
      ...prev,
      playerStats: newStats,
      missionInProgress: false,
      sbtsMinted: prev.sbtsMinted + 1,
    }));

    // Update character score
    if (currentCharacter) {
      const scoreGained = result.outcome === 'clean' ? 100 : result.outcome === 'partial' ? 60 : 30;
      setCharacterScores(prev => {
        const existing = prev.find(c => c.id === currentCharacter.id);
        if (existing) {
          return prev.map(c => 
            c.id === currentCharacter.id
              ? {
                  ...c,
                  missionsCompleted: c.missionsCompleted + 1,
                  totalScore: c.totalScore + scoreGained,
                  energy: newStats.energy,
                  control: newStats.control,
                  alignment: newStats.alignment,
                  lastPlayed: new Date().toLocaleString(),
                }
              : c
          );
        }
        return prev;
      });
    }

    setPhase("result");
  };

  const handleNextMission = () => {
    setMissionResult(null);
    startNewIncident();
  };

  const handleEnterBureau = () => {
    setPhase("character-select");
  };

  const handleSelectCharacter = (characterId: string) => {
    const character = CHARACTERS.find(c => c.id === characterId);
    if (!character) return;

    const existing = characterScores.find(c => c.id === characterId);
    if (existing) {
      setCurrentCharacter(existing);
      // Update stats from saved character
      setGameState(prev => ({
        ...prev,
        playerStats: {
          energy: existing.energy,
          control: existing.control,
          alignment: existing.alignment,
        },
      }));
      // If character has played before, don't force first mission
      setIsFirstMission(false);
    } else {
      const newCharacter: CharacterScore = {
        ...character,
        missionsCompleted: 0,
        totalScore: 0,
        energy: INITIAL_STATS.energy,
        control: INITIAL_STATS.control,
        alignment: INITIAL_STATS.alignment,
        lastPlayed: new Date().toLocaleString(),
      };
      setCurrentCharacter(newCharacter);
      setCharacterScores(prev => [...prev, newCharacter]);
      setGameState(prev => ({
        ...prev,
        playerStats: INITIAL_STATS,
      }));
      // New character starts with first mission
      setIsFirstMission(true);
    }

    setPhase("alert");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 text-white">
      {/* Dashboard Button - Available on all screens except dashboard itself */}
      {phase !== "dashboard" && characterScores.length > 0 && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setPhase("dashboard")}
          className="fixed top-4 right-4 z-40 bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full shadow-lg border-2 border-purple-400 hover:shadow-purple-500/50 transition-all"
        >
          <span className="text-2xl">📊</span>
        </motion.button>
      )}

      {phase !== "entrance" && phase !== "character-select" && phase !== "dashboard" && (
        <PlayerStats
          stats={gameState.playerStats}
          sbtsMinted={gameState.sbtsMinted}
        />
      )}

      <AnimatePresence mode="wait">
        {phase === "entrance" && (
          <motion.div
            key="entrance"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden bg-gradient-to-b from-emerald-950 via-teal-900 to-cyan-950"
          >
            {/* Floating light orbs */}
            {[...Array(12)].map((_, i) => {
              const size = 50 + (i * 7) % 100;
              const leftPos = (i * 8.33) % 100;
              const topPos = (i * 11.5) % 100;
              const xMove = (i % 2 === 0 ? 1 : -1) * (30 + (i * 5) % 20);
              const yMove = (i % 2 === 0 ? -1 : 1) * (30 + (i * 7) % 20);
              const duration = 5 + (i % 5);
              const delay = (i * 0.3) % 2;
              
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full blur-xl"
                  style={{
                    width: size,
                    height: size,
                    background: `radial-gradient(circle, ${
                      i % 3 === 0
                        ? "rgba(16, 185, 129, 0.4)"
                        : i % 3 === 1
                        ? "rgba(52, 211, 153, 0.3)"
                        : "rgba(167, 243, 208, 0.2)"
                    }, transparent)`,
                    left: `${leftPos}%`,
                    top: `${topPos}%`,
                  }}
                  animate={{
                    x: [0, xMove, 0],
                    y: [0, yMove, 0],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay,
                  }}
                />
              );
            })}

            {/* Misty overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
              }}
            />

            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center mb-12 relative z-10"
            >
              <motion.h1
                className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(16, 185, 129, 0.5)",
                    "0 0 40px rgba(16, 185, 129, 0.8)",
                    "0 0 20px rgba(16, 185, 129, 0.5)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                The Bureau of
              </motion.h1>
              <motion.h1
                className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-cyan-300 via-emerald-200 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(52,211,153,0.5)]"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(52, 211, 153, 0.5)",
                    "0 0 40px rgba(52, 211, 153, 0.8)",
                    "0 0 20px rgba(52, 211, 153, 0.5)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                Magical Things
              </motion.h1>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                className="text-2xl md:text-3xl mb-4"
              >
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                >
                  ✨
                </motion.span>
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                >
                  {" "}
                  🔮{" "}
                </motion.span>
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
                >
                  ⚡
                </motion.span>
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                >
                  {" "}
                  🌟{" "}
                </motion.span>
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.6 }}
                >
                  ✨
                </motion.span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-xl md:text-2xl text-emerald-100 mb-12 max-w-2xl mx-auto drop-shadow-lg"
              >
                Where magic and reality collide
              </motion.p>
            </motion.div>

            <div className="relative z-10 flex flex-col gap-4">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    "0 0 40px rgba(16, 185, 129, 0.8), 0 0 80px rgba(52, 211, 153, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEnterBureau}
                className="px-12 py-4 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 rounded-full text-2xl font-bold shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 border-2 border-emerald-400"
              >
                <motion.span
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(255, 255, 255, 0.5)",
                      "0 0 20px rgba(255, 255, 255, 0.8)",
                      "0 0 10px rgba(255, 255, 255, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Enter the Bureau
                </motion.span>
              </motion.button>

              {characterScores.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPhase("dashboard")}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600/80 to-pink-600/80 rounded-full text-lg font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300 border-2 border-purple-400/50"
                >
                  📊 View Dashboard
                </motion.button>
              )}
            </div>

            {/* Additional misty layers */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "radial-gradient(circle at 20% 80%, rgba(52, 211, 153, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)",
              }}
            />
          </motion.div>
        )}

        {phase === "character-select" && (
          <motion.div
            key="character-select"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900"
          >
            <motion.h2
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Choose Your Magical Identity
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-purple-200 mb-12 text-center"
            >
              Select your character to begin your journey
            </motion.p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl">
              {CHARACTERS.map((character, index) => {
                const savedChar = characterScores.find(c => c.id === character.id);
                
                return (
                  <motion.button
                    key={character.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectCharacter(character.id)}
                    className="relative bg-gradient-to-br from-purple-800/50 to-pink-800/50 backdrop-blur-sm p-6 rounded-2xl border-2 border-purple-500/30 hover:border-purple-400 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
                  >
                    {savedChar && (
                      <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full border-2 border-green-400">
                        ✓ Played
                      </div>
                    )}
                    <div className="text-6xl mb-3">{character.emoji}</div>
                    <div className="text-xl font-bold text-purple-100 mb-2">
                      {character.name}
                    </div>
                    <div className="text-sm text-purple-300 mb-2">
                      {character.description}
                    </div>
                    {savedChar && (
                      <div className="text-xs text-emerald-300 mt-2">
                        Score: {savedChar.totalScore} | Missions: {savedChar.missionsCompleted}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
              }}
            />
          </motion.div>
        )}

        {phase === "alert" && gameState.currentIncident && (
          <IncidentAlert
            key="alert"
            incident={gameState.currentIncident}
            onAccept={handleAcceptMission}
          />
        )}

        {phase === "mission" && gameState.currentIncident && (
          <motion.div
            key="mission"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {gameState.missionType === "containment" && (
              <ContainmentMission
                incident={gameState.currentIncident}
                playerStats={gameState.playerStats}
                onComplete={handleMissionComplete}
              />
            )}
            {gameState.missionType === "investigation" && (
              <InvestigationMission
                incident={gameState.currentIncident}
                playerStats={gameState.playerStats}
                onComplete={handleMissionComplete}
              />
            )}
            {gameState.missionType === "interception" && (
              <InterceptionMission
                incident={gameState.currentIncident}
                playerStats={gameState.playerStats}
                onComplete={handleMissionComplete}
              />
            )}
            {gameState.missionType === "runelock" && (
              <RuneLockMission
                incident={gameState.currentIncident}
                playerStats={gameState.playerStats}
                onComplete={handleMissionComplete}
              />
            )}
          </motion.div>
        )}

        {phase === "result" && missionResult && gameState.currentIncident && (
          <MissionResult
            key="result"
            result={missionResult}
            incident={gameState.currentIncident}
            newStats={gameState.playerStats}
            onNext={handleNextMission}
          />
        )}

        {phase === "dashboard" && (
          <Dashboard
            key="dashboard"
            characterScores={characterScores}
            onClose={() => {
              // Return to appropriate screen based on game state
              if (gameState.currentIncident) {
                setPhase("alert");
              } else if (currentCharacter) {
                setPhase("character-select");
              } else {
                setPhase("entrance");
              }
            }}
            onSelectCharacter={handleSelectCharacter}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
