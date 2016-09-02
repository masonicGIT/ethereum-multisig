'use strict'

const sjcl = require('sjcl');
const lightwallet = require('eth-lightwallet');
const Promise = require('bluebird');
const entropy = Promise.promisifyAll(require('more-entropy'));
const co = Promise.coroutine;

const generatePrivateKey = co(function* () {
  let generateEntropy = new entropy.Generator();
  // Add entropy to SJCL then generate private key
  return generateEntropy.generateAsync(100)
  .catch(function(data) {
    // The generateAsync call catches successful calls, we must catch them all
    sjcl.random.addEntropy(data, 4096, 'more-entropy');
    let privateKey = new Buffer(sjcl.random.randomWords(32), 'hex');
    return privateKey;
  });
})

const generatePublicKeyFromPrivateKey = function(privateKey) {
  return lightwallet.keystore._computePubkeyFromPrivKey(privateKey, 'curve25519');
}

const generateAddressFromPrivateKey = function(privateKey) {
  return '0x' + lightwallet.keystore._computeAddressFromPrivKey(privateKey);
}

const generateKeys = co(function* (password) {
  let privateKeyBuffer = yield generatePrivateKey();
  let privateKeyHex = privateKeyBuffer.toString('hex');
  let etherAddress = generateAddressFromPrivateKey(privateKeyHex);
  let encryptedPrivateKey = sjcl.encrypt(password, privateKeyBuffer.toString('hex'));

  return {
    privateKey: privateKeyHex,
    etherAddress: etherAddress,
    encryptedPrivateKey: encryptedPrivateKey
  }
})

module.exports = generateKeys;
 
