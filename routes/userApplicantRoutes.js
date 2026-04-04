const {Router} = require("express");
const userMiddleware = require("../middlewares/userAuthMiddleware");
const applicantProfileController = require("../controllers/applicantController");
const router = Router();

router.post('/profile', userMiddleware, applicantProfileController);

module.exports = router;