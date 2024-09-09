// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Voting {
    address private contractOwner;

    uint private numOfElections;

    struct Election {
        uint voterId;

        uint candidateId;

        bool electionStatus;

        string winner;

        uint winnerVoteCount;

        address[] candidateAddress;

        mapping (address => Candidate) candidates;

        address[] votedVoters;

        address[] votersAddress;

        mapping (address => Voter) voters;
    }

    struct Candidate {
        uint candidateId;
        uint age;
        string name;
        uint voteCount;
        address _candidateAddress;
    }

    struct Voter {
        uint id;
        string name;
        address voterAddress;
        uint candidateId;
        bool voterVoted;
    }

    mapping (uint => Election) private elections;

    event CandidateCreate (uint candidateId,uint age,string name,uint voteCount, address candidateAddress); 

    event VoterCreate (uint id,string name,address voterAddress,bool voterVoted,uint candidateId);

    modifier OnlyVoter(uint _electionId) {
        Election storage currentElection = elections[_electionId];
        require(currentElection.voters[msg.sender].voterAddress == msg.sender,"Only voters are allowed to vote");
        _;
    }

    modifier OnlyOwner {
        require(contractOwner == msg.sender,"Only contractOwner is allowed to call this function");
        _;
    }

    modifier electionStarted(uint _electionId) {
        Election storage currentElection = elections[_electionId];
        require(currentElection.electionStatus,"Election has not started");
        _;
    }

    constructor () {
        contractOwner = msg.sender;
    }

    function beginElection(uint _electionId) public OnlyOwner {
        Election storage currentElection = elections[_electionId];
        currentElection.electionStatus = true;
        numOfElections++;
    }

    function endElection(uint _electionId) public OnlyOwner electionStarted(_electionId){
        Election storage currentElection = elections[_electionId];
        for (uint i = 0; i < elections[_electionId].candidateAddress.length; i++) {
            if (currentElection.candidates[currentElection.candidateAddress[i]].voteCount > currentElection.winnerVoteCount) {
                currentElection.winnerVoteCount = currentElection.candidates[currentElection.candidateAddress[i]].voteCount;
                currentElection.winner = currentElection.candidates[currentElection.candidateAddress[i]].name;
            }
        }
        currentElection.electionStatus = false;
    }

    function electionResult(uint _electionId) public view returns (string memory _winner, uint _winnerVoteCount){
        Election storage currentElection = elections[_electionId];
        _winner = currentElection.winner;
        _winnerVoteCount = currentElection.winnerVoteCount;
    }

    function setCandidate(uint _electionId,uint _age,string memory _name,address _candidateAddress) public OnlyOwner{ 
        Election storage currentElection = elections[_electionId];
        currentElection.candidateId++;
        Candidate storage candidate =currentElection.candidates[_candidateAddress];
        candidate.candidateId = currentElection.candidateId;
        candidate.age = _age;
        candidate.name = _name;
        candidate.voteCount = 0;
        candidate._candidateAddress = _candidateAddress;
        currentElection.candidateAddress.push(_candidateAddress);
        emit CandidateCreate (currentElection.candidateId,_age,_name,candidate.voteCount, _candidateAddress);
    }

    function getCandidates(uint _electionId) public view returns (address[] memory) {
        Election storage currentElection = elections[_electionId];
        return currentElection.candidateAddress;
    }

    function getCandidateLength(uint _electionId) public view returns (uint) {
        Election storage currentElection = elections[_electionId];
        return currentElection.candidateAddress.length;
    }

    function getCandidateData(uint _electionId,address _candidateAddress) public view returns (uint,string memory,uint,uint,address) {
        Election storage currentElection = elections[_electionId];
        return (
            currentElection.candidates[_candidateAddress].candidateId,
            currentElection.candidates[_candidateAddress].name,
            currentElection.candidates[_candidateAddress].age,
            currentElection.candidates[_candidateAddress].voteCount,
            currentElection.candidates[_candidateAddress]._candidateAddress
        );
    }    

    function voterRight(uint _electionId,string memory name,address voterAddress) public OnlyOwner{
        Election storage currentElection = elections[_electionId];
        currentElection.voterId++;
        Voter storage voter = currentElection.voters[voterAddress];
        voter.id = currentElection.voterId;
        voter.name = name;
        voter.voterAddress = voterAddress;
        voter.candidateId = 1000;
        voter.voterVoted = false;
        currentElection.votersAddress.push(voterAddress);
        emit VoterCreate (voter.id,name,voterAddress,voter.voterVoted,voter.candidateId);
    }

    function vote(uint _electionId,address _candidateAddress,uint _candidateVoteId) public OnlyVoter(_electionId) electionStarted(_electionId){
        Election storage currentElection = elections[_electionId];
        Voter storage voter = currentElection.voters[msg.sender];
        require(!voter.voterVoted,"You have already voted");

        voter.voterVoted = true;

        voter.candidateId = _candidateVoteId;

        currentElection.votedVoters.push(msg.sender);

        currentElection.candidates[_candidateAddress].voteCount += 1;
    }

    function getVoterLength(uint _electionId) public view returns (uint) {
        Election storage currentElection = elections[_electionId];
        return currentElection.votedVoters.length;
    }

    function getVoterData(uint _electionId,address _voterAddress) public view returns (uint,string memory,address,uint,bool) {
        Election storage currentElection = elections[_electionId];
        return (
            currentElection.voters[_voterAddress].id,
            currentElection.voters[_voterAddress].name,
            currentElection.voters[_voterAddress].voterAddress,
            currentElection.voters[_voterAddress].candidateId,
            currentElection.voters[_voterAddress].voterVoted
        );
    } 

    function getVotedList(uint _electionId) public view returns (address[] memory) {
        Election storage currentElection = elections[_electionId];
        return currentElection.votedVoters;
    }

    function getVoteList(uint _electionId) public view returns (address[] memory) {
        Election storage currentElection = elections[_electionId];
        return currentElection.votersAddress;
    }

    function totalElections() public view returns (uint) {
        return numOfElections;
    }
}