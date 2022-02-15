const {Account} = require('./Account.js')

class User{
	constructor(userName, password){
		this.userName = userName
		this.account = Account.fromPassword(password)
		this.data = {
			name: null,
			surname: null,
			type: null
		}
	}

	init = () =>{
		return this.account.initAccount()
	}

}

const isDataStructureValid = (data) =>{
	if (data.type == 'student' || data.type == 'professor'){
		return true
	}
	return false
}


module.exports = {User, isDataStructureValid}