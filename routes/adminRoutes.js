const {Router} = require("express");
const {adminRegisterController, adminSignInController} = require("../controllers/adminController");
const router = Router();

router.post('/signup', adminRegisterController);
router.post('/signin', adminSignInController)

module.exports = router;