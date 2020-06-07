const Web3 = require('web3');
var Discord = require('discord.js');
var votingABI = require('./voting.json');
const Subspace = require('@embarklabs/subspace'); 
var auth = require('./auth.json');
var bot = new Discord.Client();


const web3 = new Web3("wss://mainnet.infura.io/ws/v3/" + auth.infuraToken);

const subspace = new Subspace.default(web3);

bot.login(auth.token);

async function initialize(channel){
    await subspace.init();
    votingContract = subspace.contract({abi: votingABI, address: '0x9b8e397c483449623525efda8f80d9b52481a3a1'});
    const startVote$ = votingContract.events.StartVote.track({fromBlock: 	9892761 });
    startVote$.subscribe((vote) => channel.send('Vote # ' + vote['0'] + " - " + vote['2']));
}

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`)
    const channel = bot.channels.cache.get('719175379218202688');
    channel.send('Howdy')
    console.log(channel);
    initialize(channel);
});

