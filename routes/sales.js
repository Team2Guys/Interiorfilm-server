const express = require('express')

const salesController = require("../controller/sales");


const salesRouter = express.Router()

salesRouter.post('/recordSale', salesController.recordSale)
salesRouter.get('/authenticate', salesController.authenticate)
salesRouter.post('/createOrder', salesController.createOrder)
salesRouter.post('/postPayement', salesController.postPayement)
salesRouter.post('/proceedPayment', salesController.proceedPayment)


module.exports = salesRouter
