// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IVoting {
    function setCandidate(uint _electionId,uint _age,string memory _name,address _candidateAddress) external;
    function getCandidates(uint _electionId) external view returns (address[] memory);
    function getCandidateData(uint _electionId,address _candidateAddress) external view returns (uint,string memory,uint,uint,address);
    function getCandidateLength(uint _electionId) external view returns (uint);
    function voterRight(uint _electionId,string memory name,address voterAddress) external;
    function vote(uint _electionId,address _candidateAddress,uint _candidateVoteId) external;
    function getVoterLength(uint _electionId) external view returns (uint);
    function getVoterData(uint _electionId,address _voterAddress) external view returns (uint,string memory,address,uint,bool);
    function getVotedList(uint _electionId) external view returns (address[] memory);
    function getVoteList(uint _electionId) external view returns (address[] memory);
    function beginElection(uint _electionId) external;
    function endElection(uint _electionId) external;
    function electionResult(uint _electionId) external view returns (string memory _winner, uint _winnerVoteCount);
    function totalElections() external view returns (uint);
}