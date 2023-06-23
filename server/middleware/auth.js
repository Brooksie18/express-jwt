const jwt = require('jsonwebtoken');
const userModel = require('../models/User')
var checkuserauth = async (req,res,next) => {
    let token
    const {authorization} = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            token = authorization.split(' ')[1]
            if (!token) {
                res.status(400).send('unauthorized user')
            }
            const {userID} = jwt.verify(token,process.env.JWT_SECRET)
            req.user = await userModel.findById(userID).select('-password')
            console.log('req',req.user)
            next()
        } catch (error) {
            res.status(400).send('unauthorized user')
        }
    }
    if (!token) {
        res.status(400).send('unauthorized user')
    }
}
module.exports=checkuserauth