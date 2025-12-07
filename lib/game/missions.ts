import type { Incident, Suspect, Enemy } from './types';

export const INCIDENTS: Incident[] = [
  {
    id: 'INC-001',
    type: 'containment',
    title: 'Rift Breach at Central Park',
    description: 'A dimensional rift is leaking unstable energy. Tap the correct nodes to seal it before it expands.',
    location: 'Central Park, Manhattan',
    urgency: 'high',
    difficulty: 2,
  },
  {
    id: 'INC-002',
    type: 'investigation',
    title: 'Suspicious Aura Detected',
    description: 'A civilian is exhibiting unusual magical signatures. Determine if they are corrupted, unstable, or innocent.',
    location: 'Brooklyn Bridge',
    urgency: 'medium',
    difficulty: 2,
  },
  {
    id: 'INC-003',
    type: 'interception',
    title: 'Shadow Entity Manifestation',
    description: 'A hostile entity has materialized. Engage and neutralize using tactical spells.',
    location: 'Times Square',
    urgency: 'high',
    difficulty: 3,
  },
  {
    id: 'INC-004',
    type: 'containment',
    title: 'Artifact Overload',
    description: 'An ancient artifact is destabilizing. Contain its energy before it causes a cascade failure.',
    location: 'Museum of Natural History',
    urgency: 'medium',
    difficulty: 3,
  },
  {
    id: 'INC-005',
    type: 'investigation',
    title: 'Memory Corruption Case',
    description: 'Multiple witnesses report missing time. Scan and assess the threat level.',
    location: 'Grand Central Terminal',
    urgency: 'low',
    difficulty: 1,
  },
  {
    id: 'INC-006',
    type: 'runelock',
    title: 'Ancient Rune Chamber',
    description: 'A sealed rune chamber has been discovered. Solve the puzzle and defeat the guardian to unlock its secrets.',
    location: 'Underground Catacombs',
    urgency: 'medium',
    difficulty: 2,
  },
];

export const SUSPECTS: Suspect[] = [
  {
    id: 'SUS-001',
    name: 'Alex Chen',
    aura: 'unstable',
    responses: [
      'I... I don\'t remember how I got here.',
      'My head feels like it\'s splitting apart.',
      'Please, I just want to go home.',
    ],
  },
  {
    id: 'SUS-002',
    name: 'Morgan Blake',
    aura: 'corrupted',
    responses: [
      'You can\'t stop what\'s coming.',
      'The shadows whisper such beautiful truths.',
      'I feel more alive than ever before.',
    ],
  },
  {
    id: 'SUS-003',
    name: 'Jordan Lee',
    aura: 'pure',
    responses: [
      'I saw something strange, but I\'m okay.',
      'Can I help? I want to understand what happened.',
      'Thank you for checking on me.',
    ],
  },
];

export const ENEMIES: Enemy[] = [
  {
    name: 'Shadow Wraith',
    health: 80,
    maxHealth: 80,
    weakness: 'bind',
    nextMove: 'Shadow Strike',
  },
  {
    name: 'Corrupted Elemental',
    health: 100,
    maxHealth: 100,
    weakness: 'drain',
    nextMove: 'Energy Burst',
  },
  {
    name: 'Void Stalker',
    health: 60,
    maxHealth: 60,
    weakness: 'attack',
    nextMove: 'Phase Shift',
  },
];

export function getRandomIncident(): Incident {
  return INCIDENTS[Math.floor(Math.random() * INCIDENTS.length)];
}

export function getRandomSuspect(): Suspect {
  return SUSPECTS[Math.floor(Math.random() * SUSPECTS.length)];
}

export function getRandomEnemy(): Enemy {
  const enemy = ENEMIES[Math.floor(Math.random() * ENEMIES.length)];
  return { ...enemy };
}
