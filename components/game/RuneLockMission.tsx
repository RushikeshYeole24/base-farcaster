"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Incident, PlayerStats, MissionResult } from "@/lib/game/types";

interface RuneLockMissionProps {
  incident: Incident;
  playerStats: PlayerStats;
  onComplete: (result: MissionResult) => void;
}

interface Position {
  x: number;
  y: number;
}

interface Enemy {
  id: number;
  position: Position;
  health: number;
  isDashing: boolean;
  isDead: boolean;
}

const GRID_SIZE = 60; // Size of each grid cell
const ROOM_SIZE = 7; // 7x7 grid

// Tile positions (in grid coordinates)
const RUNE_TILES = [
  { x: 2, y: 4, isCorrect: false },
  { x: 3, y: 4, isCorrect: true }, // Middle tile is correct
  { x: 4, y: 4, isCorrect: false },
];

const ORB_START = { x: 3, y: 3 };
const PLAYER_START = { x: 3, y: 6 };
const ENEMY_SPAWN = { x: 3, y: 2 };
const EXIT_DOOR = { x: 3, y: 1 }; // Moved from y: 0 to y: 1 so it's reachable

export default function RuneLockMission({
  incident,
  playerStats,
  onComplete,
}: RuneLockMissionProps) {
  const [playerPos, setPlayerPos] = useState<Position>(PLAYER_START);
  const [orbPos, setOrbPos] = useState<Position>(ORB_START);
  const [playerHealth, setPlayerHealth] = useState(3);
  const [enemy, setEnemy] = useState<Enemy>({
    id: 1,
    position: ENEMY_SPAWN,
    health: 1,
    isDashing: false,
    isDead: false,
  });
  const [solvedTiles, setSolvedTiles] = useState<number[]>([]);
  const [doorUnlocked, setDoorUnlocked] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [wrongTileFlash, setWrongTileFlash] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const keysPressed = useRef<Set<string>>(new Set());

  // Timer
  useEffect(() => {
    if (gameOver || doorUnlocked) return;

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver, doorUnlocked]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      if (e.key === " ") {
        e.preventDefault();
        handleAttack();
      } else {
        keysPressed.current.add(e.key.toLowerCase());
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameOver, enemy]);

  // Movement loop
  useEffect(() => {
    if (gameOver || isMoving) return;

    const moveInterval = setInterval(() => {
      if (keysPressed.current.size === 0) return;

      let newX = playerPos.x;
      let newY = playerPos.y;

      if (keysPressed.current.has("arrowup") || keysPressed.current.has("w"))
        newY--;
      if (keysPressed.current.has("arrowdown") || keysPressed.current.has("s"))
        newY++;
      if (keysPressed.current.has("arrowleft") || keysPressed.current.has("a"))
        newX--;
      if (keysPressed.current.has("arrowright") || keysPressed.current.has("d"))
        newX++;

      // Boundary check
      if (
        newX < 1 ||
        newX >= ROOM_SIZE - 1 ||
        newY < 1 ||
        newY >= ROOM_SIZE - 1
      )
        return;

      // Check if reached exit FIRST (before other movement logic)
      if (doorUnlocked && newX === EXIT_DOOR.x && newY === EXIT_DOOR.y) {
        setPlayerPos({ x: newX, y: newY });
        handleComplete(true);
        return;
      }

      // Check if pushing orb
      if (newX === orbPos.x && newY === orbPos.y) {
        const pushX = orbPos.x + (newX - playerPos.x);
        const pushY = orbPos.y + (newY - playerPos.y);

        // Check if orb can be pushed
        if (
          pushX >= 1 &&
          pushX < ROOM_SIZE - 1 &&
          pushY >= 1 &&
          pushY < ROOM_SIZE - 1
        ) {
          setIsPushing(true);
          setOrbPos({ x: pushX, y: pushY });
          setPlayerPos({ x: newX, y: newY });

          // Check if orb is on a tile
          setTimeout(() => {
            checkOrbOnTile(pushX, pushY);
            setIsPushing(false);
          }, 200);
        }
      } else {
        setPlayerPos({ x: newX, y: newY });
      }
    }, 150);

    return () => clearInterval(moveInterval);
  }, [playerPos, orbPos, gameOver, isMoving, doorUnlocked]);

  // Enemy AI
  useEffect(() => {
    if (enemy.isDead || gameOver) return;

    const enemyInterval = setInterval(() => {
      if (enemy.isDashing) return;

      // Simple patrol or dash at player
      const distToPlayer =
        Math.abs(enemy.position.x - playerPos.x) +
        Math.abs(enemy.position.y - playerPos.y);

      if (distToPlayer <= 3 && Math.random() > 0.5) {
        // Dash at player
        setEnemy((prev) => ({ ...prev, isDashing: true }));

        const dashX =
          playerPos.x > enemy.position.x
            ? 1
            : playerPos.x < enemy.position.x
            ? -1
            : 0;
        const dashY =
          playerPos.y > enemy.position.y
            ? 1
            : playerPos.y < enemy.position.y
            ? -1
            : 0;

        setTimeout(() => {
          setEnemy((prev) => {
            const newPos = {
              x: Math.max(
                1,
                Math.min(ROOM_SIZE - 2, prev.position.x + dashX * 2)
              ),
              y: Math.max(
                1,
                Math.min(ROOM_SIZE - 2, prev.position.y + dashY * 2)
              ),
            };

            // Check collision with player
            if (newPos.x === playerPos.x && newPos.y === playerPos.y) {
              setPlayerHealth((h) => {
                const newHealth = h - 1;
                if (newHealth <= 0) {
                  setGameOver(true);
                  handleComplete(false);
                }
                return newHealth;
              });
            }

            return { ...prev, position: newPos, isDashing: false };
          });
        }, 300);
      } else {
        // Slow circular patrol
        const angle = (Date.now() / 2000) % (Math.PI * 2);
        const newX = Math.round(ENEMY_SPAWN.x + Math.cos(angle) * 1.5);
        const newY = Math.round(ENEMY_SPAWN.y + Math.sin(angle) * 1.5);

        setEnemy((prev) => ({
          ...prev,
          position: {
            x: Math.max(1, Math.min(ROOM_SIZE - 2, newX)),
            y: Math.max(1, Math.min(ROOM_SIZE - 2, newY)),
          },
        }));
      }
    }, 1000);

    return () => clearInterval(enemyInterval);
  }, [enemy, playerPos, gameOver]);

  const checkOrbOnTile = (x: number, y: number) => {
    const tileIndex = RUNE_TILES.findIndex(
      (tile) => tile.x === x && tile.y === y
    );

    if (tileIndex !== -1) {
      const tile = RUNE_TILES[tileIndex];

      if (tile.isCorrect) {
        // Correct tile!
        setSolvedTiles([tileIndex]);
        setDoorUnlocked(true);
      } else {
        // Wrong tile
        setWrongTileFlash(tileIndex);
        setTimeout(() => {
          setWrongTileFlash(null);
          setOrbPos(ORB_START); // Reset orb
        }, 2000);
      }
    }
  };

  const handleAttack = () => {
    if (enemy.isDead) return;

    const distToEnemy =
      Math.abs(enemy.position.x - playerPos.x) +
      Math.abs(enemy.position.y - playerPos.y);

    if (distToEnemy <= 1) {
      setEnemy((prev) => ({ ...prev, isDead: true }));
    }
  };

  const handleComplete = (success: boolean) => {
    setGameOver(true);

    const outcome: "clean" | "partial" | "failed" =
      success && playerHealth === 3 ? "clean" : success ? "partial" : "failed";
    const energyUsed = success ? 15 : 25;
    const controlGained = success ? 15 : -5;
    const alignmentChange = success ? 5 : -3;

    setTimeout(() => {
      onComplete({
        outcome,
        alignmentChange,
        energyUsed,
        controlGained,
        storyConsequence: success
          ? "Rune lock solved! The ancient chamber opened and the magical threat was contained."
          : "Failed to unlock the rune chamber. The magical energy escaped.",
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 pt-32 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
      {/* UI Header */}
      <div className="mb-4 flex items-center gap-6">
        {/* Health */}
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="text-2xl">
              {i < playerHealth ? "❤️" : "🖤"}
            </span>
          ))}
        </div>

        {/* Puzzle Status */}
        {!doorUnlocked && (
          <div className="text-cyan-400 text-sm">
            🔮 Push orb to correct rune tile
          </div>
        )}
        {doorUnlocked && (
          <div className="text-green-400 text-sm animate-pulse">
            ✅ Exit Unlocked!
          </div>
        )}
      </div>

      {/* Game Room */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-slate-800/90 rounded-lg border-2 border-slate-600 shadow-2xl overflow-hidden"
        style={{
          width: ROOM_SIZE * GRID_SIZE,
          height: ROOM_SIZE * GRID_SIZE,
        }}
      >
        {/* Ambient glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
          }}
        />

        {/* Floor Grid */}
        <div className="absolute inset-0">
          {[...Array(ROOM_SIZE * ROOM_SIZE)].map((_, i) => {
            const x = i % ROOM_SIZE;
            const y = Math.floor(i / ROOM_SIZE);
            const isWall =
              x === 0 || x === ROOM_SIZE - 1 || y === 0 || y === ROOM_SIZE - 1;

            return (
              <div
                key={i}
                className={`absolute ${
                  isWall ? "bg-slate-700" : "bg-slate-800/50"
                }`}
                style={{
                  left: x * GRID_SIZE,
                  top: y * GRID_SIZE,
                  width: GRID_SIZE,
                  height: GRID_SIZE,
                  border: "1px solid rgba(100, 116, 139, 0.2)",
                }}
              />
            );
          })}
        </div>

        {/* Rune Floor Tiles */}
        {RUNE_TILES.map((tile, index) => {
          const isSolved = solvedTiles.includes(index);
          const isWrong = wrongTileFlash === index;

          return (
            <motion.div
              key={index}
              className="absolute flex items-center justify-center rounded-lg border-2 border-cyan-500/50"
              style={{
                left: tile.x * GRID_SIZE,
                top: tile.y * GRID_SIZE,
                width: GRID_SIZE,
                height: GRID_SIZE,
              }}
              animate={{
                boxShadow: isSolved
                  ? [
                      "0 0 20px rgba(34, 211, 238, 0.8)",
                      "0 0 40px rgba(34, 211, 238, 0.4)",
                      "0 0 20px rgba(34, 211, 238, 0.8)",
                    ]
                  : isWrong
                  ? ["0 0 20px rgba(239, 68, 68, 0.8)"]
                  : ["0 0 10px rgba(34, 211, 238, 0.3)"],
                backgroundColor: isSolved
                  ? "rgba(34, 211, 238, 0.2)"
                  : isWrong
                  ? "rgba(239, 68, 68, 0.2)"
                  : "rgba(34, 211, 238, 0.1)",
              }}
              transition={{ duration: 1, repeat: isSolved ? Infinity : 0 }}
            >
              <span className="text-3xl opacity-60">
                {isSolved ? "✓" : "◈"}
              </span>
            </motion.div>
          );
        })}

        {/* Floating Rune Orb */}
        <motion.div
          className="absolute flex items-center justify-center"
          animate={{
            left: orbPos.x * GRID_SIZE,
            top: orbPos.y * GRID_SIZE,
            scale: isPushing ? [1, 0.9, 1] : 1,
          }}
          transition={{ duration: 0.2 }}
          style={{
            width: GRID_SIZE,
            height: GRID_SIZE,
          }}
        >
          <motion.div
            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 20px rgba(192, 132, 252, 0.6)",
                "0 0 30px rgba(192, 132, 252, 0.8)",
                "0 0 20px rgba(192, 132, 252, 0.6)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xl">✦</span>
          </motion.div>
        </motion.div>

        {/* Exit Door */}
        <motion.div
          className="absolute flex items-center justify-center"
          style={{
            left: EXIT_DOOR.x * GRID_SIZE,
            top: EXIT_DOOR.y * GRID_SIZE,
            width: GRID_SIZE,
            height: GRID_SIZE,
          }}
        >
          <motion.div
            className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${
              doorUnlocked
                ? "border-yellow-400 bg-yellow-500/20"
                : "border-red-500 bg-red-500/20"
            }`}
            animate={{
              boxShadow: doorUnlocked
                ? [
                    "0 0 20px rgba(250, 204, 21, 0.8)",
                    "0 0 40px rgba(250, 204, 21, 0.4)",
                    "0 0 20px rgba(250, 204, 21, 0.8)",
                  ]
                : ["0 0 10px rgba(239, 68, 68, 0.5)"],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-2xl">{doorUnlocked ? "🚪" : "🔒"}</span>
          </motion.div>
        </motion.div>

        {/* Enemy (Light Wisp) */}
        <AnimatePresence>
          {!enemy.isDead && (
            <motion.div
              className="absolute flex items-center justify-center"
              animate={{
                left: enemy.position.x * GRID_SIZE,
                top: enemy.position.y * GRID_SIZE,
                scale: enemy.isDashing ? [1, 1.3, 1] : 1,
              }}
              exit={{
                scale: 0,
                opacity: 0,
              }}
              transition={{ duration: 0.3 }}
              style={{
                width: GRID_SIZE,
                height: GRID_SIZE,
              }}
            >
              <motion.div
                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 15px rgba(147, 197, 253, 0.8)",
                    "0 0 25px rgba(147, 197, 253, 0.6)",
                    "0 0 15px rgba(147, 197, 253, 0.8)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="text-sm">👁️</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player */}
        <motion.div
          className="absolute flex items-center justify-center"
          animate={{
            left: playerPos.x * GRID_SIZE,
            top: playerPos.y * GRID_SIZE,
          }}
          transition={{ duration: 0.15 }}
          style={{
            width: GRID_SIZE,
            height: GRID_SIZE,
          }}
        >
          <div className="text-4xl">🧙</div>
        </motion.div>

        {/* Floating dust particles */}
        {[...Array(8)].map((_, i) => {
          const x = (i * 13) % 100;
          const y = (i * 17) % 100;

          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-300/30 rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            />
          );
        })}
      </motion.div>

      {/* Controls */}
      <div className="mt-4 text-center text-sm text-gray-400">
        <p>🎮 Arrow Keys / WASD to move | Space to attack</p>
        <p className="text-xs mt-1">
          Push the glowing orb ✦ onto the correct rune tile ◈
        </p>
      </div>

      {/* Attack button for mobile */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAttack}
        className="mt-4 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg font-bold hover:from-red-500 hover:to-rose-500 transition-all"
      >
        ⚔️ Attack (or press Space)
      </motion.button>
    </div>
  );
}
