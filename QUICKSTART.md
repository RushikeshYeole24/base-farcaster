# Bureau of Magical Things - Quick Start Guide 🚀

## 1. Run the Game Locally

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start playing!

## 2. Game Controls

### Mobile-First Design
- **Tap** to interact with all elements
- **Swipe** for smooth transitions
- Optimized for portrait mode

### Gameplay Flow
1. **Incident Alert** → Read mission briefing → Accept
2. **Mission** → Complete one of three gameplay types
3. **Result** → View outcome and stat changes
4. **Next** → New incident appears

## 3. Three Mission Types

### 🧩 Containment (Puzzle)
- Tap energy nodes to seal rifts
- 8 moves, 45 seconds
- Find 6 correct nodes

### 🔍 Investigation (Deduction)
- Scan aura (auto)
- Ask 3 questions
- Choose: Detain / Purify / Observe

### ⚔️ Interception (Combat)
- Turn-based tactical combat
- 4 spells: Attack / Shield / Bind / Drain
- Find enemy weakness

## 4. Understanding Stats

### ✨ Energy (0-100)
- Used for missions
- Depletes with actions
- Regenerates between sessions

### 🧠 Control (0-100)
- Affects mission difficulty
- Increases with success
- Decreases with failure

### ⚖️ Alignment (-100 to +100)
- **Positive**: Light Guardian path
- **Neutral**: Balanced approach
- **Negative**: Shadow Drifter path

## 5. Deploy Smart Contract

### Setup Environment

```bash
# Copy .env.example to .env
cp .env.example .env

# Add your private key and RPC URLs
PRIVATE_KEY=your_wallet_private_key
BASE_SEPOLIA_RPC=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

### Deploy to Base Sepolia (Testnet)

```bash
npm run deploy:sepolia
```

### Deploy to Base Mainnet

```bash
npm run deploy:mainnet
```

### Update Frontend

After deployment, add the contract address to `.env`:

```bash
NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=0x...
```

## 6. Verify Contract

```bash
npx hardhat verify --network base-sepolia YOUR_CONTRACT_ADDRESS
```

## 7. Test SBT Minting

The game automatically mints SBTs after each mission. To test:

1. Complete a mission
2. Check console for transaction hash
3. View on Basescan: `https://sepolia.basescan.org/tx/HASH`

## 8. Customize the Game

### Add New Incidents

Edit `lib/game/missions.ts`:

```typescript
{
  id: 'INC-006',
  type: 'containment',
  title: 'Your Custom Incident',
  description: 'Your description',
  location: 'Your location',
  urgency: 'high',
  difficulty: 3,
}
```

### Adjust Game Balance

Edit `lib/game/stats.ts`:

```typescript
export const INITIAL_STATS: PlayerStats = {
  energy: 100,  // Change starting energy
  control: 50,  // Change starting control
  alignment: 0, // Change starting alignment
};
```

### Modify Visual Theme

Edit `components/game/*.tsx` - all Tailwind classes can be customized:

```typescript
// Change gradient colors
className="bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900"
```

## 9. Production Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Add to Vercel dashboard:
- `NEXT_PUBLIC_URL`
- `NEXT_PUBLIC_SBT_CONTRACT_ADDRESS`
- `UPSTASH_REDIS_REST_URL` (optional)
- `UPSTASH_REDIS_REST_TOKEN` (optional)

## 10. Troubleshooting

### Game not loading?
- Check browser console for errors
- Ensure all dependencies installed: `npm install`
- Clear Next.js cache: `rm -rf .next`

### Contract deployment fails?
- Verify private key in `.env`
- Check wallet has Base ETH
- Confirm RPC URL is correct

### SBT not minting?
- Ensure contract address in `.env`
- Check wallet is connected
- Verify contract is deployed

## 11. Performance Tips

- Game is optimized for mobile
- Uses Framer Motion for smooth animations
- Lottie files should be < 100KB
- Images should be WebP format
- Target 60fps on mobile devices

## 12. Next Steps

- [ ] Add wallet connection UI
- [ ] Implement SBT gallery view
- [ ] Create leaderboard system
- [ ] Add sound effects
- [ ] Build mission history page
- [ ] Create social sharing features

---

Need help? Check `GAME_README.md` for full documentation.
