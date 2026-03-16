const {Router} = require("express");
const adminRegisterController = require("../controllers/adminController");
const router = Router();

router.post('/signin', adminRegisterController);

module.exports = router;