'use strict'

var sjcl = require('sjcl');
var lightwallet = require('eth-lightwallet');

var generatePrivKey = function() {
  return new Buffer(sjcl.random.randomWords(32), 'hex');
}

var generatePubKeyFromPrivKey = function(privateKey) {
  return lightwallet.keystore._computePubkeyFromPrivKey(privateKey, 'curve25519');
}

var generateAddressFromPrivKey = function(privateKey) {
  return '0x' + lightwallet.keystore._computeAddressFromPrivKey(privateKey);
}

var generateKeys = function(password) {  
  let privateKey = generatePrivKey();
  let publicKey = generatePubKeyFromPrivKey(privateKey);
  let etherAddress = generateAddressFromPrivKey(privateKey);
  let encryptedPrivateKey = sjcl.encrypt(password, privateKey.toString('hex'));

  return {
    privateKey: privateKey,
    etherAddress: etherAddress,
    encryptedPrivateKey: encryptedPrivateKey
  }
}

module.exports = generateKeys;
 
