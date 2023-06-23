const userModel = require('../models/User');
const passwordModel = require('../models/PasswordReset')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Util = require('../Utils')
const util = new Util();
const nodemailer = require('../config/emailConfig')
const string = require('../helpers/function')
class UserController{
    static async userRegistration(req,res) {
        const {name,email,password} = req.body
        const userCheck = await userModel.findOne({email:email})
        if (userCheck) {
            util.setError(400,'User is already exist')
            return util.send(res)
        }
        if (name && email && password) {
            try {
                const salt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(password,salt)
                const doc = new userModel({
                    name:name,
                    email:email,
                    password:hashPassword
                })
                await doc.save()
                let token = await jwt.sign({userID:doc._id},process.env.JWT_SECRET,{expiresIn:'5d'})
                let userwithToken  = {'_id':doc._id,'name':doc.name,'email':doc.email,'token':token}
                util.setSuccess(200,'User Created Successfully',userwithToken)
            } catch(error) {
                util.setError(500,error.message)
            }
            return util.send(res)
        } else {
            util.setError(400,'all field are required')
            return util.send(res)
        }
    }
    static async userLogin(req,res) {
        const {email,password} = req.body
        if (email && password) {
            let userCheck = await userModel.findOne({email:email})
            if (userCheck) {
                const isMatch = await bcrypt.compare(password,userCheck.password)
                if (userCheck.email == email && isMatch == true) {
                    let token = await jwt.sign({userID:userCheck._id},process.env.JWT_SECRET,{expiresIn:'5d'})
                    let userwithToken  = {'_id':userCheck._id,'name':userCheck.name,'email':userCheck.email,'token':token}
                    util.setSuccess(200,'User logged in Successfully',userwithToken)
                } else {
                    util.setError(400,'Email and Password not match') 
                }
            } else {
                util.setError(400,'User is not found')
            }
        } else {
            util.setError(400,'Email and Password is required for login')
        }
        return util.send(res) 
    }
    static async changePassword(req,res) {
        const {password,password_confirm} = req.body
        if (password == password_confirm) {
            const salt = await bcrypt.genSalt(12)
            const hashPassword = await bcrypt.hash(password,salt)
            console.log(req.user._id)
            await userModel.findByIdAndUpdate(req.user._id,{
                $set:{
                    password:hashPassword
                }
            }) 
            util.setSuccess(200,'Password changed Successfully',req.user)
        } else {
            util.setError(400,'Password and Confirm password not match')
        }
        return util.send(res) 
    }
    static async getUser(req,res) {
        util.setSuccess(200,'User get successfully',req.user)
        return util.send(res) 
    }

    static async forgetPassword(req,res) {
        const email = req.body.email
        if (email) {
            let userCheck = await userModel.findOne({email:email})
            if (userCheck) {
                let token = string(30);
                const resetPassword = new passwordModel({
                    email:email,
                    token:token
                })
                await resetPassword.save()
                  // send mail with defined transport object
                let info = await nodemailer.sendMail({
                    from:  'naman<techtic.naman@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Reset Password", // Subject line
                    text:  `hello ${userCheck.name}`, // plain text body
                    html: "here is the reset password link <a href='http://localhost:3000/api/reset/"+token+"'>click here</a>", // html body
                });
                util.setSuccess(200,'Reset email send successfully',token)
            } else {
                util.setError(400,'Email not found')
            }
        } else {
            util.setError(400,'Please enter your email')
        }
        return util.send(res) 
    }
    static async resetPassword(req,res) {
        const token = req.params.token
        const d = new Date();
        if (token) {
            let tokenCheck = await passwordModel.findOne({token:token,expired_at: {$gte: d}})
            if (tokenCheck) {
                const salt = await bcrypt.genSalt(12)
                const hashPassword = await bcrypt.hash(req.body.password,salt)
                await userModel.findOneAndUpdate({email:tokenCheck.email},{password:hashPassword})
                await passwordModel.findByIdAndDelete(tokenCheck._id);
                util.setSuccess(200,'Reset password successfully',tokenCheck)
            } else {
                util.setError(400,'Token not found')
            }
        } else {
            util.setError(400,'Invalid data')  
        }
        return util.send(res) 
    }
}
module.exports=UserController