const controller = require('../controller/news_Letter');
const { Router } = require('express');
const {authenticate} = require('../middleware/authhandler')
const new_letter_router = Router();

new_letter_router.post('/Add_email', controller.promotional_handler)
new_letter_router.post('/send_promotional_email',authenticate, controller.promotional_forward_handler)
new_letter_router.get('/get-all',authenticate, controller.get_all_user)

new_letter_router.delete('/del-user/:id',authenticate, controller.deleteProduct)




module.exports = new_letter_router;
