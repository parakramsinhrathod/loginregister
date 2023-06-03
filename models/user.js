const mongoose = require('mongoose')
const Schema = mongoose.Schema


const UserSchema = Schema({
    mobile: { 
        type: Number, 
        required: true
    }, 
    password : { 
        type: String, 
        required: true
    }, 
    name: { 
        type: String, 
        required: true
    }
})

UserSchema.statics.uniqueMobile = async function(mobile){
    const checkMobile = await this.findOne({mobile})
    return checkMobile ? false : true

}

UserSchema.statics.validatePassword = async function(mobile, pwd) {
    const checkPwd = await this.findOne({mobile})
    return checkPwd.password === pwd ? true  : false
}

// UserSchema.static.findAndValidate = async function(mobile, password){
//     const foundUser = await this.findOne({mobile})
//     const isValid = await UserSchema.compare
// }



module.exports = mongoose.model('User' , UserSchema)