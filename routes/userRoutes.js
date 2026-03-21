const {Router} = require("express");
const {userRegisterController, userSignInController} = require("../controllers/userController");
const router = Router();

router.post('/signup', userRegisterController);
router.post('/signin', userSignInController)

module.exports = router;