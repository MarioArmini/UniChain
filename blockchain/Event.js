const CryptoUtil = require("../util/cryptoUtil.js")
const CryptoEDDSAUtil = require("../util/cryptoEDDSAUtil.js")


class Event{
	constructor(){
		this.id = null
		this.hash = null
		this.type = null
		this.data = {
			inputs: [],
			outputs: []
		}
	}

	toHash = () =>{
		return CryptoUtil.hash(this.id + this.type + JSON.stringify(this.data))
	}

	static fromJson = (data) =>{
		let event = new Event()
		for (var ev in data){
			event[ev] = data[ev]
		}
		event.hash = event.toHash()
		return event
	}
}

module.exports = Event