const express = require('express')

const usr = require("../controller/usr")
const {authenticate} = require('../middleware/authhandler')

const usrRouter = express.Router()

usrRouter.post('/signup',usr.signup )
usrRouter.post('/login', usr.login)
usrRouter.post('/emailVarify', usr.userHandler)
usrRouter.post('/passwordReset', usr.passwordReset2)
usrRouter.post('/getuserHandler',authenticate, usr.getuserHandler)


module.exports  = usrRouter