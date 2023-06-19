const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const {body} = require('express-validator')
const checkRole = require("../middleware/checkRoleMiddleware");

router.post('/registration',
    body('firstName').isLength({min: 2,max: 32}),
    body('email').isEmail(),
    body('password').trim().isLength({min: 8}),
    userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.post('/sendEmail', userController.sendEmail)
router.post('/sendCheck', userController.sendCheck)
router.post('/updateUser', userController.updateUser)
router.post('/createAddress', userController.createAddress)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/getUsers', userController.getUsers)
router.get('/getAllAddress', userController.getAllAddress)




module.exports = router