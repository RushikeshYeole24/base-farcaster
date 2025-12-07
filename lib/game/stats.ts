import type { PlayerStats, MissionOutcome, MissionType } from './types';

export const INITIAL_STATS: PlayerStats = {
  energy: 100,
  control: 50,
  alignment: 0, // Neutral
};

export function getAlignmentLabel(alignment: number): string {
  if (alignment > 50) return 'Light Guardian';
  if (alignment > 20) return 'Light Leaning';
  if (alignment > -20) return 'Neutral';
  if (alignment > -50) return 'Shadow Touched';
  return 'Shadow Drifter';
}

export function calculateDifficulty(
  baseDifficulty: number,
  stats: PlayerStats
): number {
  // Higher control = easier missions
  const controlModifier = (100 - stats.control) / 100;
  return Math.max(1, Math.min(5, baseDifficulty * (1 + controlModifier * 0.5)));
}

export function applyMissionResult(
  stats: PlayerStats,
  outcome: MissionOutcome,
  type: MissionType,
  energyUsed: number
): PlayerStats {
  const newStats = { ...stats };

  // Energy cost
  newStats.energy = Math.max(0, stats.energy - energyUsed);

  // Control changes based on outcome
  if (outcome === 'clean') {
    newStats.control = Math.min(100, stats.control + 10);
  } else if (outcome === 'partial') {
    newStats.control = Math.min(100, stats.control + 3);
  } else {
    newStats.control = Math.max(0, stats.control - 5);
  }

  // Alignment changes based on mission type and outcome
  if (type === 'containment') {
    if (outcome === 'clean') newStats.alignment += 5;
    else if (outcome === 'failed') newStats.alignment -= 10;
  } else if (type === 'investigation') {
    // Handled by specific choices in investigation
  } else if (type === 'interception') {
    if (outcome === 'clean') newStats.alignment += 3;
    else if (outcome === 'failed') newStats.alignment -= 8;
  }

  newStats.alignment = Math.max(-100, Math.min(100, newStats.alignment));

  return newStats;
}

export function regenerateEnergy(stats: PlayerStats): PlayerStats {
  return {
    ...stats,
    energy: Math.min(100, stats.energy + 20),
  };
}
