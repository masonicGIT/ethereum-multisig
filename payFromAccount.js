'use strict'
const config = require('./config');
const assert = require('assert');
const Lightwallet = require('eth-lightwallet');
const getNonce = require('./getNonce');
const getBalance = require('./getBalance');
const Transaction = require('ethereumjs-tx');

const send = function(params) {
    assert(params.privateKey, 'Missing privateKey');
    assert(params.from, 'Missing from address');
    assert(params.to, 'Missing to address');
    assert(params.amountInWei, 'Missing the amountInWei');

    let privateKey = params.privateKey;
    let from = params.from;
    let to = params.to;
    let amountInWei = params.amountInWei; 

    return getBalance(from)
    .then(balance => {
      console.log('balance: ' + balance)
      console.log('amountInWei: ' + amountInWei)
      console.log('config.gasPrice: ' + config.gasPrice)
      if (amountInWei + config.gasPrice > balance) {
	throw new Error('Insufficient funds');
      }
      return getNonce(from)
    })
    .then(nonce => {

      let transactionOptions = {
  	gasPrice: config.gasPrice,
        gasLimit: 200000,
  	value: amountInWei,
  	nonce: nonce + 1,
        to: to,
        from: from
      }

      let tx = new Transaction(transactionOptions);
      privateKey = new Buffer(privateKey, 'hex');
      tx.sign(privateKey);
      let rawTx = tx.serialize().toString('hex');
      console.log(rawTx);      
      return console.log(rawTx);
  })
  .catch(err => {
    throw new Error(err);
  })
};

module.exports = send;

