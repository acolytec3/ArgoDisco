const Web3 = require('web3');
const Subspace = require('@embarklabs/subspace'); 
const Discord = require('discord.js');
const votingABI = require('./voting.json');
const tokensABI = require('./tokens.json');
const financeABI = require('./finance.json'); 
const config = require('./bot_config.json');

const web3 = new Web3("wss://mainnet.infura.io/ws/v3/" + config.infuraToken);
const subspace = new Subspace.default(web3);

const bot = new Discord.Client();

bot.login(config.botDiscordToken);

async function initialize(channel){
    await subspace.init();
    votingContract = subspace.contract({abi: votingABI, address: config.votingAddress});
    tokensContract = subspace.contract({abi: tokensABI, address: config.tokensAddress});
    financeContract = subspace.contract({abi: financeABI, address: config.financeAddress});
    const startVote$ = votingContract.events.StartVote.track({fromBlock: 	9892761 });
    const mintToken$ = tokensContract.events.NewVesting.track({fromBlock: 	9892761 });
    const burnToken$ = tokensContract.events.RevokeVesting.track({fromBlock: 	9892761 });
    const newPayment$ = financeContract.events.NewPayment.track({fromBlock: 9892761});
    startVote$.subscribe(function(vote){
        channel.send('Vote # ' + vote['0'] + " - " + vote['2'])
        console.log(vote)
    });
}

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`)
    const channel = bot.channels.cache.find(channel => channel.name == 'general')
    channel.send('Howdy')
    initialize(channel);
});

