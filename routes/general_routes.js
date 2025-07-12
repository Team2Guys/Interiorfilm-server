const { Router } = require('express');
const generalController = require('../controller/general');
const router = Router();

const generalApiEndpoints = {
    addredirecturl: "/addredirecturl",
    getSignleredirecturl: "/getSignleredirecturl/:url",
    updateredirecturl: "/updateredirecturl/:url",
    getredirecturl: "/getredirecturl",
    deleteredirecturl: "/deleteredirecturl/:url"
};



router.post(generalApiEndpoints.addredirecturl, generalController.createRedirecturl);
router.get(generalApiEndpoints.getSignleredirecturl, generalController.findSingleRedirect);
router.patch(generalApiEndpoints.updateredirecturl, generalController.updateRedirectUrl);
router.get(generalApiEndpoints.getredirecturl, generalController.findAll);
router.delete(generalApiEndpoints.deleteredirecturl, generalController.DeleteRedirect);

module.exports = router;