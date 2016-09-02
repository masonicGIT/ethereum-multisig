'use strict'
const config = require('./config');
const generateKeys = require('./generateKeys');

const Promise = require('bluebird');
const co = Promise.coroutine;
const Web3 = require('web3');
const web3 = new Web3();
const provider = new web3.providers.HttpProvider('http://localhost:8545');
web3.setProvider(provider);

let publicKeys = [];
let accounts = [];

if (process.argv.length < 4) {
  console.log('Usage: node createWallet.js < m > < n > < password for key-pair 1/n > < password for key-pair 2/n > < password for key-pair n/n >');
  process.exit(-1);
}

const m = parseInt(process.argv[2]);
const n = parseInt(process.argv[3]);

if (process.argv.length < (4 + n)) {
  let passwordMessage = '';
  for (let i = 1; i < n; i++) {
    passwordMessage += ' < password for key-pair ' + i + '/' + n + ' >';
  }
  console.log('Usage: node createWallet.js < m > < n >' + passwordMessage); 
  process.exit(-1);
}

const createWallet = co(function* () {
  for (let i = 0; i < (n - 1) ; i++) {
    let wallet = yield generateKeys(process.argv[4 + i]);
    accounts.push(wallet);
    publicKeys.push(wallet.etherAddress);
  }
  return accounts;
});

return createWallet()
.then(function(accounts) {
  const walletContract = web3.eth.contract(config.multiSignature.abi);
  const data = {
    from: config.wallet.etherAddress,
    data: config.multiSignature.code.original,
    gas: 3000000
  };
  const spendingLimit = 0;
  let wallet = walletContract.new(publicKeys, m, spendingLimit, data, function(error, contract) {
    console.log('Account key information: \n');
    console.dir(accounts[0]);
    console.dir(accounts[1]);
    if (contract.transactionHash) {
      console.log('Contract transaction hash: \n');
      console.dir(contract.transactionHash);
    }
    if (!contract.address) {
      console.log('Waiting for Ethereum network confirmation...\n');
    } else {
      console.log('Multisignature wallet address\n');
      console.dir(contract.address);
      return;
    }
  });
})





