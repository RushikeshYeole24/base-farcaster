# No Repeat Missions Feature

## Overview
Implemented a system to prevent the same missions from repeating for a character until all available missions have been completed.

## Changes Made

### 1. Mission Selection Logic (`lib/game/missions.ts`)
- Updated `getRandomIncident()` to accept an `excludeIds` parameter
- Filters out already completed incidents when selecting a new mission
- Automatically resets and allows all missions again once all have been completed

### 2. Character Progress Tracking (`components/game/GameContainer.tsx`)
- Added `completedIncidentIds: string[]` to `CharacterScore` interface
- Tracks which specific incident IDs each character has completed
- Persists to localStorage along with other character data

### 3. Mission Completion Handling
- When a mission is completed, the incident ID is added to the character's `completedIncidentIds` array
- This list is passed to `getRandomIncident()` to exclude already-played missions
- Both the character scores state and current character state are updated

### 4. Backward Compatibility
- Existing saved characters without `completedIncidentIds` are automatically migrated
- Empty array is added on load to prevent errors

## How It Works

1. **New Character**: Starts with empty `completedIncidentIds` array
2. **Mission Selection**: System excludes all incident IDs in the character's completed list
3. **Mission Completion**: Incident ID is added to the character's completed list
4. **All Missions Completed**: When all 6 incidents are completed, the system resets and allows all missions again

## Available Missions
- INC-001: Containment - Rift Breach
- INC-002: Investigation - Suspicious Aura
- INC-003: Interception - Shadow Entity
- INC-004: Containment - Artifact Overload
- INC-005: Investigation - Memory Corruption
- INC-006: RuneLock - Ancient Rune Chamber
- INC-FIRST: RuneLock - First Mission (for new characters)

## Benefits
- Each character gets a unique progression through all available missions
- No repetitive gameplay until all content is experienced
- Character-specific tracking allows different characters to have different progress
- Smooth reset after completing all missions for continued gameplay
