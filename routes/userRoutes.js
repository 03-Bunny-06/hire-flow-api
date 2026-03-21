const {Router} = require("express");
const userRegisterController = require("../controllers/userController");
const router = Router();

router.post('/signup', userRegisterController);

module.exports = router;