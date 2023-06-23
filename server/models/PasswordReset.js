const mongoose = require('mongoose')
const passwordSchema = new mongoose.Schema({
    email:{type:String,required:true,trim:true},
    token:{type:String,required:true,trim:true},
    expired_at:{type:Date,default:Date.now() + (15 * 60 * 1000)}
})
const password = new mongoose.model('passwordReset',passwordSchema)
module.exports = password