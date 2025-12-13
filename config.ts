import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { base, baseSepolia } from "@reown/appkit/networks";

// Get project ID from environment
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error("NEXT_PUBLIC_PROJECT_ID is not defined");
}

// Create wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  networks: [base, baseSepolia],
  projectId,
});