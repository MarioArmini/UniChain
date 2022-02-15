const CryptoUtil = require("../util/cryptoUtil.js")
const CryptoEDDSAUtil = require("../util/cryptoEDDSAUtil.js")
const Event = require("../Blockchain/Event.js")

class EventBuilder{
	constructor(){
		this.fromAddress = null
		this.outputAddress = null
		this.changeAddress = null
		this.scretKey = null
		this.type = ''
	}

	from = (fromAddress) =>{
		this.fromAddress = fromAddress
		return this
	}

	to = (address) =>{
		this.outputAddress = address
		return this
	}

	change = (address) =>{
		this.changeAddress = address
		return this
	}

	sign = (secretKey) =>{
		this.secretKey = secretKey
		return this
	}

	eventType = (type) => {
		this.type = type
	}

	build = () =>{
		if(this.outputAddress == null) throw new Error("ERROR: output address must be defined")

		let inputs = {from: this.fromAddress}
		let outputs = {to: this.outputAddress}

		return Event.fromJson({
			id: CryptoUtil.randomID(64),
			hash: null,
			type: this.type,
			data: {
				inputs: inputs,
				outputs: outputs
			}
		})
	}

	buildWithExamInfo = (data) =>{
		if(this.outputAddress == null) throw new Error("ERROR: output address must be defined")
		if(!isExamDataStructureValid(data)) throw new Error("ERROR: exam data not valid")

		let inputs = {
			from: this.fromAddress,
			exam: data.examName,
			course: data.course,
			CFU: data.CFU,
			hours: data.hours,
			classroom: data.classroom
		}
		let outputs = {to: this.outputAddress}

		return Event.fromJson({
			id: CryptoUtil.randomID(64),
			hash: null,
			type: this.type,
			data: {
				inputs: inputs,
				outputs: outputs
			}
		})
	}
}

const isExamDataStructureValid = (data) =>{
	return typeof data.examName === 'string'
			&& typeof data.course === 'string'
			&& typeof data.CFU === 'number'
			&& typeof data.hours === 'string'
			&& typeof data.classroom === 'string'
}

module.exports = EventBuilder