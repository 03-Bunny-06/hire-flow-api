const {Router} = require("express");
const adminMiddleware = require("../middlewares/adminAuthMiddleware");
const {adminRegisterController, adminSignInController} = require("../controllers/adminController");
const router = Router();

router.post('/signup', adminRegisterController);
router.post('/signin', adminSignInController);
router.get('/dashboard-stats', adminMiddleware);

module.exports = router;