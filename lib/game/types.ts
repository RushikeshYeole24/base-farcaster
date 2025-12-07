// Core game types for Bureau of Magical Things

export type MissionType = 'containment' | 'investigation' | 'interception' | 'runelock';

export type Alignment = 'light' | 'neutral' | 'shadow';

export type MissionOutcome = 'clean' | 'partial' | 'failed';

export interface PlayerStats {
  energy: number; // ✨ Energy (0-100)
  control: number; // 🧠 Control (0-100)
  alignment: number; // ⚖️ Alignment (-100 to +100, negative = shadow, positive = light)
}

export interface Incident {
  id: string;
  type: MissionType;
  title: string;
  description: string;
  location: string;
  urgency: 'low' | 'medium' | 'high';
  difficulty: number; // 1-5, affected by player stats
}

export interface MissionResult {
  outcome: MissionOutcome;
  alignmentChange: number;
  energyUsed: number;
  controlGained: number;
  storyConsequence: string;
}

export interface SBTMetadata {
  missionType: MissionType;
  outcome: MissionOutcome;
  alignmentChange: number;
  energyUsed: number;
  incidentId: string;
  timestamp: number;
  playerStatsSnapshot: PlayerStats;
}

// Containment Mission (Puzzle)
export interface EnergyNode {
  id: number;
  x: number;
  y: number;
  active: boolean;
  correct: boolean;
}

export interface ContainmentState {
  nodes: EnergyNode[];
  movesLeft: number;
  timeLeft: number;
  correctNodes: number[];
}

// Investigation Mission (Deduction)
export interface Suspect {
  id: string;
  name: string;
  aura: 'corrupted' | 'unstable' | 'pure';
  responses: string[];
}

export interface InvestigationState {
  suspect: Suspect;
  questionsAsked: number;
  maxQuestions: 3;
  decision: 'detain' | 'observe' | 'purify' | null;
}

// Interception Mission (Turn-Based Combat)
export type SpellType = 'attack' | 'shield' | 'bind' | 'drain';

export interface Enemy {
  name: string;
  health: number;
  maxHealth: number;
  weakness: SpellType;
  nextMove: string;
}

export interface InterceptionState {
  playerHealth: number;
  playerEnergy: number;
  enemy: Enemy;
  turn: number;
  shieldActive: boolean;
  enemyBound: boolean;
}

export interface GameState {
  currentIncident: Incident | null;
  playerStats: PlayerStats;
  missionInProgress: boolean;
  missionType: MissionType | null;
  sbtsMinted: number;
}
