const fs = require("fs")
const CryptoUtil = require("../util/cryptoUtil.js")
const CryptoEDDSAUtil = require("../util/cryptoEDDSAUtil.js")


const privateKeyLocation = process.env.PRIVATE_KEY || '../private/account/private_key'

class Account{
	constructor(){
		this.id = null
		this.passHash = null
		this.secret = null
		this.keyPairs = []
	}

	initAccount = () =>{
		if(this.secret == null){
			this.generateSecret()
		}

		let lastKeyPair = this.keyPairs.at(-1)
		let secret = (lastKeyPair == null ? this.secret : CryptoEDDSAUtil.generateSecret(lastKeyPair))
		let keyPair = CryptoEDDSAUtil.generateKeypairFromSecret(secret)
		let newKeypair = {
			index : this.keyPairs.length + 1,
			privateKey : CryptoEDDSAUtil.toHex(keyPair.getSecret()),
			publicKey : CryptoEDDSAUtil.toHex(keyPair.getPublic())
		}
		this.keyPairs.push(newKeypair)
		return newKeypair.publicKey
	}

	generateSecret = () =>{
		this.secret = CryptoEDDSAUtil.generatePassword(this.passHash)
		return this.secret
	}

	getAddressFromIndex = (indexToFind) =>{
		var key = null
		this.keyPairs.forEach(function(keypair){
			if(keypair.index === indexToFind){
				key = keypair.publicKey
			}
		})
		return key
	}

	getAddressFromPublicKey = (keyToFind) =>{
		var key = null
		this.keyPairs.forEach(function(keypair){
			if(keypair.publicKey === keyToFind){
				key = keypair.publicKey
			}
		})
		return key
	}

	getSecretFromPublic = (keyToFind) =>{
		var secret = null
		this.keyPairs.forEach(function(keypair){
			if(keypair.publicKey === keyToFind){
				secret = keypair.privateKey
			}
		})
		return secret
	}

	getAddresses = () =>{
		var addresses = []
		this.keyPairs.forEach(function(keypair){
			addresses.push(keypair.publicKey)
		})
		return addresses
	}


	static fromPassword = (password) => {
        let account = new Account()
        account.id = CryptoUtil.randomID()
        account.passHash = CryptoUtil.hash(password)
        return account
    }

    static fromHash = (passwordHash) => {
        let account = new Account()
        account.id = CryptoUtil.randomID()
        account.passHash = passwordHash
        return account
    }

}


module.exports = {Account}
