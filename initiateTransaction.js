'use strict'
const config = require('./config');
const Lightwallet = require('eth-lightwallet');
const getNonce = require('./getNonce');
const Tx = require('ethereumjs-tx');
const Promise = require('bluebird');
const co = Promise.coroutine;

const initiateTransaction = co(function* (privateKey, from, receivingAddress, amount, contractWallet) {

  let nonce = yield getNonce(from);   
  let transactionOptions = {
      gasPrice: config.gasPrice,
      gasLimit: config.gasLimit,
      value: 0,
      to: contractWallet,
      nonce: nonce,
      data: null
  }
  let transactionArgs = [receivingAddress, amount];
  let unsignedTransaction = Lightwallet.txutils.functionTx(config.multiSignature, 'execute', transactionArgs, transactionOptions);
  let unsignedTransactionBuffer = new Buffer(unsignedTransaction, 'hex');  
  let transaction = new Tx(unsignedTransactionBuffer);
  let privateKeyToBuffer = new Buffer(privateKey, 'hex');
  transaction.sign(privateKeyToBuffer);

  return transaction.serialize().toString('hex');
});

module.exports = initiateTransaction;