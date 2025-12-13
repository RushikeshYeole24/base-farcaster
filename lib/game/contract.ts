import { type PublicClient, type WalletClient, getContract } from "viem";
import type { SBTMetadata } from "./types";

// ABI for BureauSBT contract (minimal interface)
const BUREAU_SBT_ABI = [
  {
    name: "mintMissionRecord",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "player", type: "address" },
      { name: "missionType", type: "string" },
      { name: "outcome", type: "string" },
      { name: "alignmentChange", type: "int8" },
      { name: "energyUsed", type: "uint8" },
      { name: "incidentId", type: "string" },
      { name: "energySnapshot", type: "uint8" },
      { name: "controlSnapshot", type: "uint8" },
      { name: "alignmentSnapshot", type: "int8" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getMissionRecord",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "missionType", type: "string" },
          { name: "outcome", type: "string" },
          { name: "alignmentChange", type: "int8" },
          { name: "energyUsed", type: "uint8" },
          { name: "incidentId", type: "string" },
          { name: "timestamp", type: "uint256" },
          { name: "energySnapshot", type: "uint8" },
          { name: "controlSnapshot", type: "uint8" },
          { name: "alignmentSnapshot", type: "int8" },
        ],
      },
    ],
  },
  {
    name: "tokensOfOwner",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export class BureauSBTContract {
  private contract: any = null;
  private walletClient: WalletClient | null = null;

  constructor(
    private contractAddress: `0x${string}`,
    private publicClient: PublicClient
  ) {}

  async connect(walletClient: WalletClient) {
    this.walletClient = walletClient;
    this.contract = getContract({
      address: this.contractAddress,
      abi: BUREAU_SBT_ABI,
      client: { public: this.publicClient, wallet: walletClient },
    });
  }

  async mintMissionSBT(
    playerAddress: `0x${string}`,
    metadata: SBTMetadata
  ): Promise<string> {
    if (!this.contract || !this.walletClient)
      throw new Error("Contract not connected");

    try {
      const hash = await this.contract.write.mintMissionRecord([
        playerAddress,
        metadata.missionType,
        metadata.outcome,
        metadata.alignmentChange,
        metadata.energyUsed,
        metadata.incidentId,
        metadata.playerStatsSnapshot.energy,
        metadata.playerStatsSnapshot.control,
        metadata.playerStatsSnapshot.alignment,
      ]);

      return hash;
    } catch (error) {
      console.error("Error minting SBT:", error);
      throw error;
    }
  }

  async getPlayerSBTs(playerAddress: `0x${string}`): Promise<number[]> {
    if (!this.contract) throw new Error("Contract not connected");

    try {
      const tokenIds = await this.contract.read.tokensOfOwner([playerAddress]);
      return tokenIds.map((id: bigint) => Number(id));
    } catch (error) {
      console.error("Error fetching SBTs:", error);
      return [];
    }
  }

  async getMissionRecord(tokenId: number): Promise<SBTMetadata | null> {
    if (!this.contract) throw new Error("Contract not connected");

    try {
      const record = await this.contract.read.getMissionRecord([
        BigInt(tokenId),
      ]);

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
      console.error("Error fetching mission record:", error);
      return null;
    }
  }

  async getPlayerBalance(playerAddress: `0x${string}`): Promise<number> {
    if (!this.contract) throw new Error("Contract not connected");

    try {
      const balance = await this.contract.read.balanceOf([playerAddress]);
      return Number(balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      return 0;
    }
  }
}

// Helper to create contract instance
export function createBureauSBTContract(
  contractAddress: `0x${string}`,
  publicClient: PublicClient
): BureauSBTContract {
  return new BureauSBTContract(contractAddress, publicClient);
}
