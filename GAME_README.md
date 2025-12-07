# Bureau of Magical Things 🎮

A mobile-first onchain web game built with Next.js, Framer Motion, and Solidity.

## Game Overview

**Player Role:** Bureau Field Initiate  
**Mission:** Respond to live magical incidents  
**Session Length:** 2-4 minutes per mission  
**Platform:** Mobile-first Web App

## Gameplay Types

### 1. Containment (Puzzle) 🧩
- Tap correct energy nodes to seal dimensional rifts
- Limited moves + timer
- Success → +Control | Failure → +Shadow

### 2. Investigation (Deduction) 🔍
- Scan auras and ask questions
- Choose: Detain / Observe / Purify
- Right choice → +Bureau Trust | Wrong → Shadow Drift

### 3. Interception (Turn-Based Tactical) ⚔️
- Cast spells: Attack / Shield / Bind / Drain
- Limited energy, enemy has hidden weakness
- Strategic combat with consequences

## Player Stats (Only 3)

- ✨ **Energy** (0-100): Resource for missions
- 🧠 **Control** (0-100): Affects mission difficulty
- ⚖️ **Alignment** (-100 to +100): Light ↔ Shadow path

## Soulbound Tokens (ERC-5192)

Every mission completion mints ONE non-transferable SBT storing:
- Mission Type
- Outcome (Clean / Partial / Failed)
- Alignment Change
- Energy Used
- Incident ID
- Timestamp
- Player Stats Snapshot

## Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lottie React** - Lightweight animations

### Smart Contracts
- **Solidity ^0.8.20** - Smart contract language
- **ERC-5192** - Soulbound Token standard
- **OpenZeppelin** - Contract libraries

### Blockchain
- **Base** - L2 network
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library

## Project Structure

```
base-farcaster/
├── app/
│   └── page.tsx                    # Main entry point
├── components/
│   └── game/
│       ├── GameContainer.tsx       # Main game wrapper
│       ├── PlayerStats.tsx         # Stats display
│       ├── IncidentAlert.tsx       # Mission intro
│       ├── ContainmentMission.tsx  # Puzzle gameplay
│       ├── InvestigationMission.tsx # Deduction gameplay
│       ├── InterceptionMission.tsx # Combat gameplay
│       └── MissionResult.tsx       # Result screen
├── lib/
│   └── game/
│       ├── types.ts                # TypeScript types
│       ├── stats.ts                # Stats logic
│       └── missions.ts             # Mission data
└── contracts/
    └── BureauSBT.sol               # Soulbound Token contract
```

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Smart Contract Deployment

### 1. Install Hardhat (if not already)

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
npx hardhat init
```

### 2. Deploy to Base Sepolia (Testnet)

```bash
# Add your private key to .env
PRIVATE_KEY=your_private_key_here
BASE_SEPOLIA_RPC=https://sepolia.base.org

# Deploy
npx hardhat run scripts/deploy.js --network base-sepolia
```

### 3. Deploy to Base Mainnet

```bash
# Update .env with mainnet RPC
BASE_MAINNET_RPC=https://mainnet.base.org

# Deploy
npx hardhat run scripts/deploy.js --network base-mainnet
```

## Visual Design Constraints

### ✅ Allowed
- Static PNG/JPG backgrounds
- Lottie animations for magic effects
- SVG/PNG UI assets
- Canvas or layered div rendering
- Framer Motion transitions

### ❌ Forbidden
- 3D models
- Unity / Unreal
- Spine animations
- Full-body rigs
- Heavy MP4 videos

All visuals are lightweight, web-optimized, and mobile-compatible.

## Game Balance

### Energy Costs
- Containment: 15-35 energy
- Investigation: 20-30 energy
- Interception: 20-40 energy

### Control Gains
- Clean Success: +10
- Partial Success: +3
- Failure: -5

### Alignment Shifts
- Light actions: +3 to +8
- Shadow actions: -5 to -15
- Neutral: 0

## Future Enhancements

- [ ] Multiplayer co-op missions
- [ ] Guild system with shared SBT collections
- [ ] Seasonal events with unique incidents
- [ ] NFT cosmetics (non-gameplay affecting)
- [ ] Leaderboards based on SBT achievements
- [ ] Story branching based on alignment path

## License

MIT

## Contributing

This is a game template. Feel free to fork and customize for your own magical universe!

---

Built with ⚡ by Bureau of Magical Things Team
