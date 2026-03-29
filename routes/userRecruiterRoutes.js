const {Router} = require("express");
const {userMiddleware} = require("../middlewares/userAuthMiddleware");
const {recruiterProfileController, recruiterProfile} = require("../controllers/recruiterController")
const router = Router();

router.post('/profile', userMiddleware, recruiterProfileController);
router.get('/profile', userMiddleware, recruiterProfile);
router.post('/', userMiddleware);

module.exports = router;