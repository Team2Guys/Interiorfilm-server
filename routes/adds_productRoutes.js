const { Router } = require('express');
const controller = require('../controller/adds');
const Adds_products_router = Router();
const { authenticate } = require('../middleware/authhandler')




const ApiEndPoints = {
    addProduct: "/addProduct",
    getAllproducts: "/getAllproducts",
    deleteProduct: "/deleteProduct/:id",
    updateProduct: "/updateProduct/:id",
}


Adds_products_router.post(ApiEndPoints.addProduct, authenticate, controller.addProduct)
Adds_products_router.get(ApiEndPoints.getAllproducts, controller.getAllproducts)
Adds_products_router.put(ApiEndPoints.updateProduct,authenticate, controller.edit_productHanler)
Adds_products_router.delete(ApiEndPoints.deleteProduct,authenticate, controller.deleteProduct)



module.exports = Adds_products_router;
