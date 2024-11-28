const express = require('express')

const usr = require("../controller/usr")
const { authenticate } = require('../middleware/authhandler')

const usrRouter = express.Router()

usrRouter.post('/signup', usr.signup)
usrRouter.post('/login', usr.login)
usrRouter.post('/emailVarify', usr.userHandler)
usrRouter.post('/verifyOtp', usr.verifyOtp)
usrRouter.post('/passwordReset', usr.passwordReset2)
usrRouter.get('/getuserHandler', authenticate, usr.getuserHandler)
usrRouter.put('/userEdit/:id', authenticate, usr.editUserHandler)


module.exports = usrRouter