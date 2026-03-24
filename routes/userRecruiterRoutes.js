const {Router} = require("express");
const userMiddleware = require("../middlewares/userAuthMiddleware");
const recruiterProfileController = require("../controllers/recruiterController")
const router = Router();

router.post('/profile', userMiddleware, recruiterProfileController);

module.exports = router;