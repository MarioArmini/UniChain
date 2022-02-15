const {Block, genesisBlock, calculateHash} = require("./Block")
const CryptoJS = require("crypto-js")
const level = require("level")
const {User, isDataStructureValid} = require("../user/User.js")
const Event = require("./Event.js")
const EventBuilder = require("../user/EventBuilder.js")


var blockchain = [genesisBlock()]
//var dbPosition = process.env.DB_PATH || '../database/data'


const getCurrentTimestamp = () => {
	return Math.round(new Date().getTime() / 1000)
}

const getBlockchain = () => {
	return blockchain
}

const getLatestBlock = () => {
	return blockchain[blockchain.length - 1]
}

const generateNewBlock = (blockData) => {
	const previousBlock = getLatestBlock()
	const nextIndex = previousBlock.index + 1
	const nextTimestamp = getCurrentTimestamp()
	const newBlock = findBlock(nextIndex, previousBlock.hash, nextTimestamp, JSON.parse(blockData))
	if(addBlockToChain(newBlock)){
		return newBlock
	}
	return null
}

const findBlock = (index, previousHash, timestamp, data) => {
	var hash = calculateHash(index, previousHash, timestamp, data)
	return new Block(index, previousHash, timestamp, data, hash)
}

const calculateHashForBlock = (block) => {
	return calculateHash(block.index, block.previousHash, block.timestamp, block.data);
}

const isNewblockValid = (newBlock, previousBlock) => {
	if(!isBlockStructureValid(newBlock)){
		console.log("Invalid block structure: %s", JSON.stringify(newBlock))
		return false
	}
	if(previousBlock.index + 1 !== newBlock.index){
		console.log("Invalid index")
		return false
	} else if(previousBlock.hash !== newBlock.previousHash){
		console.log("Invalid previous hash at block " + newBlock.index)
		return false
	} else if(!isTimestampValid(newBlock, previousBlock)){
		console.log("Invalid timestamp")
		return false
	} else if(!hasValidHash(newBlock)){
		return false
	}
	return true
}

const isTimestampValid = (newBlock, previousBlock) => {
	return(previousBlock.timestamp - 60 < newBlock.timestamp) && newBlock.timestamp - 60 < getCurrentTimestamp()
}

const isBlockStructureValid = (block) => {
	return typeof block.index === 'number'
	&& typeof block.previousHash === 'string'
	&& typeof block.timestamp === 'number'
	&& typeof block.data === 'object'
	&& typeof block.hash === 'string'
}

const hashMatchesBlockContent = (block) => {
	const blockHash = calculateHashForBlock(block)
	return blockHash === block.hash
}

const hasValidHash = (block) => {
	if(!hashMatchesBlockContent(block)){
		console.log("Invalid hash for block " + block.index + ". Got " + block.hash)
		return false;
	}
	return true
}

const addBlockToChain = (newBlock) =>{
	if(isNewblockValid(newBlock, getLatestBlock())){
		blockchain.push(newBlock)
		return true
	}
	return false
}

const mineAccountCreation = (user) =>{
	if(isDataStructureValid(user.data)){
		const publicKey = user.init()

		const blockData = JSON.stringify({account_generated: publicKey})

		if(generateNewBlock(blockData) !== null){
			console.log(blockchain.at(-1))
			return publicKey
		}
	}
	console.error("Invalid data")
}

const mineEvent = (event) =>{
	const blockData = JSON.stringify({event_emitted: event.id,
										type: event.type})
	if(generateNewBlock(blockData) !== null){
		console.log(blockchain.at(-1))
		return event
	}
}

const retrieveBlockchainDataFromDB = async () =>{
	const iter = db.iterator()
	for await (let [key, value]of iter){
		const block = JSON.parse(value)
		console.log(block)
	}
}

const testEventCreation = (from, to, data) =>{
	const eventBuilder = new EventBuilder()

	eventBuilder.from(from)
	eventBuilder.to(to)
	eventBuilder.eventType("exam")
	return eventBuilder.buildWithExamInfo(data)
}

var u1 = new User("m.armini", "13051997Ma@")
u1.data = {type: 'professor'}
var from = mineAccountCreation(u1)
var u2 = new User("a.capasso", "buebdwhwidh")
u2.data = {type: 'student'}
var to = mineAccountCreation(u2)
var dataExam = {examName: "matematica 1", course: "Ingegneria informatica", CFU: 12, hours: "12:30", classroom: "G12"}
var event = testEventCreation(from, to, dataExam)
console.log(mineEvent(event))

