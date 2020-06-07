const Web3 = require('web3');
var votingABI = require('./voting.json');
const Subspace = require('@embarklabs/subspace'); 

const web3 = new Web3("wss://mainnet.infura.io/ws/v3/{yourAppIdHere}");

const subspace = new Subspace.default(web3);

async function initialize(){
    await subspace.init();
    votingContract = subspace.contract({abi: votingABI, address: '0x9b8e397c483449623525efda8f80d9b52481a3a1'});
    
    console.log(votingContract.events);
    const startVote$ = votingContract.events.StartVote.track({fromBlock: 0});
    startVote$.subscribe((vote) => console.log(vote));
}

initialize();