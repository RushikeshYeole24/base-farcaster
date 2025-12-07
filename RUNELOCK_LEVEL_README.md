# 🏰 Rune Lock Cell Mission

## Overview
A minimal IQ-Dungeon style level featuring a single-room puzzle-combat challenge. Players must solve a rune puzzle while avoiding or defeating a Light Wisp enemy.

## Level Specifications

### Session Length
90-150 seconds

### Camera View
Top-down grid-based (7x7 grid, 60px cells)

### Core Loop
Enter → Solve Rune Puzzle → Defeat/Avoid Enemy → Exit

## Level Layout

```
┌─────────────────────────┐
│        Exit Door        │
│      (Locked Rune)      │
│                         │
│     ●  (Enemy Spawn)    │
│                         │
│   ◻      ◻      ◻       │  ← 3 Rune Floor Tiles
│                         │
│         ✦               │  ← Floating Rune Orb
│                         │
│       Player Spawn      │
└─────────────────────────┘
```

## Environment (Minimal IQ-Dungeon Style)

### Floor
- Dark stone tiles
- One bright rune engraved on each of 3 puzzle tiles
- Soft cyan glow on interactive tiles

### Walls
- Flat stone walls
- Thin vertical glowing cracks (ambient light)
- No clutter (clean readability)

### Ambient FX (Ultra Light)
- 8 floating dust particles
- Subtle light pulse every 5 seconds

## Exit Door

### Visual
- Simple stone door
- One circular rune at center

### Locked State
- Rune is red
- Flickering animation

### Unlocked State
- Rune turns gold
- Emits slow outward light waves

## Puzzle Mechanic

### Elements
- 3 Floor Rune Tiles
- 1 Floating Rune Orb (movable)

### Goal
Player must push the floating rune orb onto the correct floor tile (middle tile).

### Feedback
- **Correct Tile**: Tile locks in, bright pulse, exit door rune activates
- **Wrong Tile**: Tile flashes red once, orb resets to center after 2s

### Orb Physics
- Slides smoothly
- No rotation needed
- Stops exactly at tile center

## Enemy: Light Wisp

### Visual
- Small floating orb
- White core
- Faint blue outer fog ring

### Movement
- Slow circular patrol around center
- Dashes at player when within 3 tiles

### Attack
- Dashes forward in straight line
- Deals 1 damage hit
- Pauses for 2 seconds after dash

### Death
- Shrinks and pops into 6 tiny spark particles
- Silent fade

## Player Avatar (Minimal)

### Look
- Hooded figure (🧙 emoji)
- Small glowing eyes
- One short sword or staff

### Movement
- Clean sliding step motion
- Arrow Keys / WASD controls
- No footstep particles

### Attack
- Quick forward strike
- Space bar or Attack button
- One-frame light slash arc

## UI (IQ-Dungeon Clean Style)

- ❤️ Health: 3 tiny hearts at top-left
- 🔮 Puzzle status indicator
- ✅ Exit unlocked notification
- No inventory, timer, or minimap

## Controls

### Keyboard
- **Arrow Keys / WASD**: Move
- **Space**: Attack

### Mobile
- Touch controls for movement
- Attack button

## Mission Flow

1. Player spawns
2. Wisp activates
3. Player avoids/hits wisp
4. Player pushes orb to correct tile
5. Correct tile unlocks door
6. Player exits
7. Mission ends → SBT Mint

## Scoring

- **Clean (100 pts)**: Complete with full health
- **Partial (60 pts)**: Complete with damage taken
- **Failed (30 pts)**: Player health reaches 0

## Integration

The Rune Lock Mission is integrated into the game as a new mission type:
- Mission Type: `'runelock'`
- Component: `RuneLockMission.tsx`
- Appears randomly in mission rotation
- Tracked in character dashboard

## Technical Details

- Built with React + Framer Motion
- Grid-based positioning system
- Keyboard event handling for controls
- Enemy AI with patrol and dash behaviors
- Collision detection for player, enemy, and orb
- LocalStorage integration for character progress
