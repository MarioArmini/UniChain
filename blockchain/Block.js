var CryptoJS = require("crypto-js")

class Block{
	constructor(index, previousHash, timestamp, data, hash){
		this.index = index
		this.previousHash = previousHash.toString()
		this.timestamp = timestamp
		this.data = data
		this.hash = hash.toString()
	}
}

const genesisBlock = () => {
	return new Block(0, '0', 0, JSON.parse('{"data": "GENESIS_BLOCK"}'), '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7')
}

const calculateHash = (index, previousHash, timestamp, data) => {
	return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
}

module.exports = {Block, genesisBlock, calculateHash}