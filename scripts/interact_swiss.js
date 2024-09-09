const hre = require("hardhat");
const {
  encryptDataField,
  decryptNodeResponse,
} = require("@swisstronik/swisstronik.js");

const sendShieldedTransaction = async (signer, destination, data, value) => {
  // Get the RPC link from the network configuration
  const rpclink = hre.network.config.url;

  // Encrypt transaction data
  const [encryptedData] = await encryptDataField(rpclink, data);

  // Construct and sign transaction with encrypted data
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

const sendShieldedQuery = async (provider, destination, data) => {
  const rpclink = hre.network.config.url;
  const [encryptedData, usedEncryptedKey] = await encryptDataField(
    rpclink,
    data
  );
  const response = await provider.call({
    to: destination,
    data: encryptedData,
  });
  return await decryptNodeResponse(rpclink, response, usedEncryptedKey);
};

async function main() {
  const contractAddress = "0x3b6A553842d32908185000E208F345A5a081de8C";
  const [signer1, signer2, signer3, signer4, signer5] =
    await ethers.getSigners();
  const contractFactory = await hre.ethers.getContractFactory("Voting");
  const contract = contractFactory.attach(contractAddress);

  /////////// Start Election ////////////////
  const beginElectionTx = await sendShieldedTransaction(
    signer1,
    contractAddress,
    contract.interface.encodeFunctionData("beginElection", [1]),
    0
  );
  await beginElectionTx.wait();

  //////////// Registering Candidates /////////////////
  const setCandidateTx1 = await sendShieldedTransaction(
    signer1,
    contractAddress,
    contract.interface.encodeFunctionData("setCandidate", [
      1,
      45,
      "Obi",
      signer1.address,
    ]),
    0
  );
  await setCandidateTx1.wait();

  const setCandidateTx2 = await sendShieldedTransaction(
    signer1,
    contractAddress,
    contract.interface.encodeFunctionData("setCandidate", [
      1,
      50,
      "Tinubu",
      signer2.address,
    ]),
    0
  );
  await setCandidateTx2.wait();

  const setCandidateTx3 = await sendShieldedTransaction(
    signer1,
    contractAddress,
    contract.interface.encodeFunctionData("setCandidate", [
      1,
      55,
      "Atiku",
      signer3.address,
    ]),
    0
  );
  await setCandidateTx3.wait();

  ///////////// Registering Voters ///////////////////////
  const voterRightTx1 = await sendShieldedTransaction(
    signer1,
    contractAddress,
    contract.interface.encodeFunctionData("voterRight", [
      1,
      "joshua",
      signer4.address,
    ]),
    0
  );
  await voterRightTx1.wait();

  const voterRightTx2 = await sendShieldedTransaction(
    signer1,
    contractAddress,
    contract.interface.encodeFunctionData("voterRight", [
      1,
      "James",
      signer5.address,
    ]),
    0
  );
  await voterRightTx2.wait();

  const voterRightTx3 = await sendShieldedTransaction(
    signer1,
    contractAddress,
    contract.interface.encodeFunctionData("voterRight", [
      1,
      "Simon",
      signer3.address,
    ]),
    0
  );
  await voterRightTx3.wait();

  const voterRightTx4 = await sendShieldedTransaction(
    signer1,
    contractAddress,
    contract.interface.encodeFunctionData("voterRight", [
      1,
      "Andrew",
      signer2.address,
    ]),
    0
  );
  await voterRightTx4.wait();

  /////////////// Voters Voting //////////////////////////////
  const voteTx1 = await sendShieldedTransaction(
    signer2,
    contractAddress,
    contract.interface.encodeFunctionData("vote", [1, signer1.address, 1]),
    0
  );
  await voteTx1.wait();

  const voteTx2 = await sendShieldedTransaction(
    signer3,
    contractAddress,
    contract.interface.encodeFunctionData("vote", [1, signer1.address, 1]),
    0
  );
  await voteTx2.wait();

  const voteTx3 = await sendShieldedTransaction(
    signer4,
    contractAddress,
    contract.interface.encodeFunctionData("vote", [1, signer2.address, 2]),
    0
  );
  await voteTx3.wait();

  const voteTx4 = await sendShieldedTransaction(
    signer5,
    contractAddress,
    contract.interface.encodeFunctionData("vote", [1, signer1.address, 1]),
    0
  );
  await voteTx4.wait();

  ////////////// Getting the total votes //////////////////////
  const votersLengthMessage = await sendShieldedQuery(
    signer1.provider,
    contractAddress,
    contract.interface.encodeFunctionData("getVoterLength", [0])
  );
  console.log(
    "Number of Voters:",
    contract.interface.decodeFunctionResult(
      "getVoterLength",
      votersLengthMessage
    )[0]
  );

  //////////// Candidate Information During Election /////////////////////
  const candidateDataAfterMessage1 = await sendShieldedQuery(
    signer1.provider,
    contractAddress,
    contract.interface.encodeFunctionData("getCandidateData", [
      1,
      signer1.address,
    ])
  );
  console.log(
    "First Candidate Data:",
    contract.interface.decodeFunctionResult(
      "getCandidateData",
      candidateDataAfterMessage1
    )
  );

  const candidateDataAfterMessage2 = await sendShieldedQuery(
    signer1.provider,
    contractAddress,
    contract.interface.encodeFunctionData("getCandidateData", [
      1,
      signer2.address,
    ])
  );
  console.log(
    "Second Candidate Data:",
    contract.interface.decodeFunctionResult(
      "getCandidateData",
      candidateDataAfterMessage2
    )
  );

  const candidateDataAfterMessage3 = await sendShieldedQuery(
    signer1.provider,
    contractAddress,
    contract.interface.encodeFunctionData("getCandidateData", [
      1,
      signer3.address,
    ])
  );
  console.log(
    "Third Candidate Data:",
    contract.interface.decodeFunctionResult(
      "getCandidateData",
      candidateDataAfterMessage3
    )
  );

  ///////////// End Election //////////////////////
  const endElectionTx = await sendShieldedTransaction(
    signer1,
    contractAddress,
    contract.interface.encodeFunctionData("endElection", [1]),
    0
  );
  await endElectionTx.wait();

  ///////////// Election Result //////////////////////////
  const ElectionResultMessage = await sendShieldedQuery(
    signer1.provider,
    contractAddress,
    contract.interface.encodeFunctionData("electionResult", [1])
  );
  console.log(
    "Election Winner:",
    contract.interface.decodeFunctionResult(
      "electionResult",
      ElectionResultMessage
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
