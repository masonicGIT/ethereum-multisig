'use strict'
const getRequest = require('./getRequest.js');
const Promise = require('bluebird');
const _ = require('lodash');

const getNonce = function(address) {
  let url = 'https://api.etherscan.io/api?module=account&action=txlist&address=' + address + '&sort=asc';

  return getRequest(url)
  .then(txListData => {    
    if (txListData.status == 0) { 
      return new Error(txListData.message);
    }

    let transactionList = [];
    txListData.result.forEach(function(tx) {
      transactionList.push(tx);
    });
    
    transactionList = _.filter(transactionList, (data => { return data.from == address }));
    const nonce = transactionList.length;

    return nonce;
  })
  .catch(err => {
    throw new Error(err);
  });
}

module.exports = getNonce;

