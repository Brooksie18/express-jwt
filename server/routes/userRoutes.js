const { Router } = require("express");
const userController = require("../controllers/userController");
const auth = require('../middleware/auth')
const router = Router();
router.use('/change-password',auth)
router.use('/user',auth)

router.post('/signup',userController.userRegistration)
router.post('/login',userController.userLogin)
router.post('/change-password',userController.changePassword)
router.get('/user',userController.getUser)
router.post('/forget-password',userController.forgetPassword)
router.post('/reset/:token',userController.resetPassword)
module.exports=router