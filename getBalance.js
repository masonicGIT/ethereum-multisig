'use strict'
const getRequest = require('./getRequest.js');
const Promise = require('bluebird');
const _ = require('lodash');

const getBalance = function(address) {
  return new Promise((resolve, reject) => {
    let url = 'https://api.etherscan.io/api?module=account&action=balance&address=' + address + '&tag=latest';
    
    return getRequest(url)
    .then(response => {    
      if (response.status == 0) { 
	reject(response.message);
      }
      resolve(response.result);
    })
    .catch(err => {
      reject(err);
    });
  });
};

module.exports = getBalance;

