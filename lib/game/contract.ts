import { ethers } from 'ethers';
import type { SBTMetadata } from './types';

// ABI for BureauSBT contract (minimal interface)
const BUREAU_SBT_ABI = [
  'function mintMissionRecord(address player, string missionType, string outcome, int8 alignmentChange, uint8 energyUsed, string incidentId, uint8 energySnapshot, uint8 controlSnapshot, int8 alignmentSnapshot) external returns (uint256)',
  'function getMissionRecord(uint256 tokenId) external view returns (tuple(string missionType, string outcome, int8 alignmentChange, uint8 energyUsed, string incidentId, uint256 timestamp, uint8 energySnapshot, uint8 controlSnapshot, int8 alignmentSnapshot))',
  'function tokensOfOwner(address owner) external view returns (uint256[])',
  'function balanceOf(address owner) external view returns (uint256)',
];

export class BureauSBTContract {
  private contract: ethers.Contract | null = null;
  private signer: ethers.Signer | null = null;

  constructor(
    private contractAddress: string,
    private provider: ethers.Provider
  ) {}

  async connect(signer: ethers.Signer) {
    this.signer = signer;
    this.contract = new ethers.Contract(
      this.contractAddress,
      BUREAU_SBT_ABI,
      signer
    );
  }

  async mintMissionSBT(
    playerAddress: string,
    metadata: SBTMetadata
  ): Promise<string> {
    if (!this.contract) throw new Error('Contract not connected');

    try {
      const tx = await this.contract.mintMissionRecord(
        playerAddress,
        metadata.missionType,
        metadata.outcome,
        metadata.alignmentChange,
        metadata.energyUsed,
        metadata.incidentId,
        metadata.playerStatsSnapshot.energy,
        metadata.playerStatsSnapshot.control,
        metadata.playerStatsSnapshot.alignment
      );

      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error minting SBT:', error);
      throw error;
    }
  }

  async getPlayerSBTs(playerAddress: string): Promise<number[]> {
    if (!this.contract) throw new Error('Contract not connected');

    try {
      const tokenIds = await this.contract.tokensOfOwner(playerAddress);
      return tokenIds.map((id: bigint) => Number(id));
    } catch (error) {
      console.error('Error fetching SBTs:', error);
      return [];
    }
  }

  async getMissionRecord(tokenId: number): Promise<SBTMetadata | null> {
    if (!this.contract) throw new Error('Contract not connected');

    try {
      const record = await this.contract.getMissionRecord(tokenId);
      
      return {
        missionType: record.missionType as any,
        outcome: record.outcome as any,
        alignmentChange: Number(record.alignmentChange),
        energyUsed: Number(record.energyUsed),
        incidentId: record.incidentId,
        timestamp: Number(record.timestamp),
        playerStatsSnapshot: {
          energy: Number(record.energySnapshot),
          control: Number(record.controlSnapshot),
          alignment: Number(record.alignmentSnapshot),
        },
      };
    } catch (error) {
      console.error('Error fetching mission record:', error);
      return null;
    }
  }

  async getPlayerBalance(playerAddress: string): Promise<number> {
    if (!this.contract) throw new Error('Contract not connected');

    try {
      const balance = await this.contract.balanceOf(playerAddress);
      return Number(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  }
}

// Helper to create contract instance
export function createBureauSBTContract(
  contractAddress: string,
  provider: ethers.Provider
): BureauSBTContract {
  return new BureauSBTContract(contractAddress, provider);
}
