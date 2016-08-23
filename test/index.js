var generateKeys = require('../generateKeys');
var should = require('should');

describe('Generate Keys', function() {
  it('should generate private key', function() {
    should(generateKeys('test').privateKey).be.ok
    should(generateKeys('test').privateKey.length).equal(32);
  });
  
  it('should generate ethereum address', function() {
    should(generateKeys('test').etherAddress).be.ok
    should(generateKeys('test').etherAddress.length).equal(32);
  });

  it('should generate private key', function() {
    should(generateKeys('test').encryptedPrivKey).be.ok
  });

});
