const crypto = require('crypto');
const elliptic = require('elliptic');

const EdDSA = elliptic.eddsa;
const ec = new EdDSA('ed25519');
// const SALT = '0ffaa74d206930aaece253f090c88dbe6685b9e66ec49ad988d84fd7dff230d1';
const SALT = 'E67AE5236BFAFA8C71872BE7D788FF02E21AECDA38D7DAC0E91D1359F4B1F368'


class CryptoEDDSAUtil{
	static generatePassword = (password) =>{
		let secret = crypto.pbkdf2Sync(password, SALT, 10000, 512, 'sha512').toString('hex')
		console.debug("Secret: " + secret)
		return secret
	}

	static generateKeypairFromSecret = (secret) =>{
		let keyPair = ec.keyFromSecret(secret)
		console.debug("Public key obtained: " + elliptic.utils.toHex(keyPair.getPublic()))
		return keyPair
	}

	static signHash = (keyPair, msgHash) =>{
		let signature = keyPair.sign(msgHash).toHex().toLowerCase()
		console.debug("Signature: " + signature)
		return signature
	}

	static verifySignature = (publicKey, signature, msgHash) =>{
		let key = ec.keyFromPublic(publicKey, 'hex')
		let verified = key.verify(msgHash, signature)
		console.debug("Verified: " + verified)
		return verified
	}

	static toHex = (data) =>{
		return elliptic.utils.toHex(data)
	}
}

module.exports = CryptoEDDSAUtil


