// Deploy script for BureauSBT contract
const hre = require("hardhat");

async function main() {
  console.log("Deploying BureauSBT contract...");

  // Get the contract factory
  const BureauSBT = await hre.ethers.getContractFactory("BureauSBT");
  
  // Deploy the contract
  const bureauSBT = await BureauSBT.deploy();
  
  await bureauSBT.waitForDeployment();
  
  const address = await bureauSBT.getAddress();
  
  console.log("✅ BureauSBT deployed to:", address);
  console.log("\nAdd this to your .env file:");
  console.log(`NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=${address}`);
  
  // Wait for a few block confirmations
  console.log("\nWaiting for block confirmations...");
  await bureauSBT.deploymentTransaction().wait(5);
  
  console.log("\n🔍 Verify contract on Basescan:");
  console.log(`npx hardhat verify --network ${hre.network.name} ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
