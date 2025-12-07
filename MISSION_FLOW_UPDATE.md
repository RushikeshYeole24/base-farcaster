# Mission Flow Update

## Changes Made

### First Mission Logic
The game now ensures that **RuneLockMission** is always the first mission for each character, followed by random missions.

### Implementation Details

1. **New State Variable**: `isFirstMission`
   - Tracks whether the current session should show the first mission
   - Initialized as `true` for new characters
   - Set to `false` for returning characters

2. **Modified `startNewIncident()` Function**
   - Checks `isFirstMission` flag
   - If `true`: Creates a RuneLock mission incident
   - If `false`: Gets a random mission from all available types
   - Sets `isFirstMission` to `false` after first mission

3. **Updated `handleSelectCharacter()` Function**
   - New characters: `isFirstMission = true` (will see RuneLock first)
   - Returning characters: `isFirstMission = false` (will see random missions)

## Mission Flow

### For New Characters:
```
Title Screen → Character Selection → RuneLock Mission → Random Missions
```

### For Returning Characters:
```
Title Screen → Character Selection → Random Missions
```

## Mission Types Available

After the first RuneLock mission, the game randomly selects from:
1. **RuneLock** - Rune puzzle with Light Wisp enemy
2. **Investigation** - Connect 4 Ropes puzzle
3. **Containment** - Energy Node puzzle
4. **Interception** - Turn-based combat

## Benefits

- ✅ Consistent onboarding experience with RuneLock tutorial
- ✅ Variety after first mission with random selection
- ✅ Returning players skip tutorial and get straight to variety
- ✅ Each character tracks their own first mission status
- ✅ Maintains character progression and stats

## Technical Notes

- First mission incident is created inline with type safety
- Random missions use existing `getRandomIncident()` function
- Character progress persists in localStorage
- Dashboard tracks all missions completed per character
