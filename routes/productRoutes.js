const { Router } = require('express');
const controller = require('../controller/products');
const upload = require('../middleware/ImageUpload')
const router = Router();
const { authenticate } = require('../middleware/authhandler')

const ApiEndPoints = {
    addProduct: "/addProduct",
    getAllproducts: "/getAllproducts",
    deleteProduct: "/deleteProduct/:id",
    addProductImage: "/addProductImage",
    updateProduct: "/updateProduct/:id",
    getPaginateProducts: "/getPaginateProducts",
    getOrderHistory: "/order-history",
    trackorder: "/track-order",


    // Categories
    AddCategory: "/AddCategory",
    getAllcategories: "/getAllcategories",
    deleteCategory: "/deleteCategory/:id",
    updateCategory: '/updateCategory/:id',
    getCategory: '/getCategory/:id',

    Removeimage: "/removeProductImage",

    // email
    email: "/sendEmail",

}

router.post(ApiEndPoints.addProduct, controller.addProduct)
router.get(ApiEndPoints.getAllproducts, controller.getAllproducts)
router.get(ApiEndPoints.getPaginateProducts, controller.getPaginateProducts)
router.get(ApiEndPoints.getOrderHistory, authenticate, controller.userOrderHistory)
router.get(ApiEndPoints.trackorder, controller.trackorder)
router.post(ApiEndPoints.updateProduct, controller.productHanler)

router.delete(ApiEndPoints.deleteProduct, controller.deleteProduct)
router.post(ApiEndPoints.addProductImage, upload.array('image'), controller.addProductImage)
router.post(ApiEndPoints.updateProduct, controller.productHanler)
router.delete(ApiEndPoints.Removeimage, controller.deleteProductImage)



// email sender 
router.post(ApiEndPoints.email, controller.sendEmailHandler)




// Categories

router.post(ApiEndPoints.AddCategory, controller.AddCategory);
router.get(ApiEndPoints.getAllcategories, controller.getAllcategories);
router.post(ApiEndPoints.updateCategory, controller.editCategoryHandler);
router.delete(ApiEndPoints.deleteCategory, controller.deleteCategory);
router.get(ApiEndPoints.getCategory, controller.getCategory);


module.exports = router;
