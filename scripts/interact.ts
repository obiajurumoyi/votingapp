import { ethers } from "hardhat";

async function main() {
  const [signer1, signer2, signer3, signer4, signer5] =
    await ethers.getSigners();
  const votingApp = await ethers.getContractAt(
    "IVoting",
    "0x945DF74cE9948954fBA93E1c859fCDF14f5150D0"
  );

  const beginElection = await votingApp.beginElection(0);

  await beginElection.wait();

  const candidate1 = await votingApp.setCandidate(
    0,
    45,
    "Obi",
    signer1.address
  );
  const candidate2 = await votingApp.setCandidate(
    0,
    50,
    "Tinubu",
    signer2.address
  );
  const candidate3 = await votingApp.setCandidate(
    0,
    55,
    "Atiku",
    signer3.address
  );

  await Promise.all([candidate1.wait(), candidate2.wait(), candidate3.wait()]);

  const candidate1_data = await votingApp.getCandidateData(0, signer1.address);
  const candidate2_data = await votingApp.getCandidateData(0, signer2.address);
  const candidate3_data = await votingApp.getCandidateData(0, signer3.address);

  console.log(candidate1_data, candidate2_data, candidate3_data);

  const candidatesLength = await votingApp.getCandidateLength(0);

  console.log(candidatesLength);

  const createVoter1 = await votingApp.voterRight(0, "drake", signer4.address);

  const createVoter2 = await votingApp.voterRight(0, "mark", signer5.address);

  const createVoter3 = await votingApp.voterRight(0, "chris", signer3.address);

  const createVoter4 = await votingApp.voterRight(0, "simon", signer2.address);

  await Promise.all([
    createVoter1.wait(),
    createVoter2.wait(),
    createVoter3.wait(),
    createVoter4.wait(),
  ]);

  const voter1 = await votingApp.getVoterData(0, signer4.address);

  const voter2 = await votingApp.getVoterData(0, signer5.address);

  const voter3 = await votingApp.getVoterData(0, signer3.address);

  const voter4 = await votingApp.getVoterData(0, signer2.address);

  console.log(voter1, voter2, voter3, voter4);

  const voting1 = await votingApp.connect(signer4).vote(0, signer2.address, 2);

  const voting2 = await votingApp.connect(signer5).vote(0, signer1.address, 1);

  const voting3 = await votingApp.connect(signer3).vote(0, signer1.address, 1);

  const voting4 = await votingApp.connect(signer2).vote(0, signer1.address, 1);

  await Promise.all([
    voting1.wait(),
    voting2.wait(),
    voting3.wait(),
    voting4.wait(),
  ]);

  const votersLength = await votingApp.getVoterLength(0);
  console.log(votersLength);

  const candidate1_data_after = await votingApp.getCandidateData(
    0,
    signer1.address
  );
  const candidate2_data_after = await votingApp.getCandidateData(
    0,
    signer2.address
  );
  const candidate3_data_after = await votingApp.getCandidateData(
    0,
    signer3.address
  );

  console.log(
    candidate1_data_after,
    candidate2_data_after,
    candidate3_data_after
  );

  const endElection = await votingApp.endElection(0);

  await endElection.wait();

  const electionResult = await votingApp.electionResult(0);

  console.log(electionResult);
}

// We recommend this pattern to be able to use async/await everywhere 0x5FbDB2315678afecb367f032d93F642f64180aa3
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
