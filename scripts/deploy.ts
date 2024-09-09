import { ethers } from "hardhat";

async function main() {
  const votingApp = await ethers.deployContract("Voting", []);

  await votingApp.waitForDeployment();

  console.log(votingApp.target);
}
//github.com/Joshaw-k/Voting_and_Uniswap.git
// We recommend this pattern to be able to use async/await everywhere 0x5FbDB2315678afecb367f032d93F642f64180aa3
// and properly handle errors.
https: main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
