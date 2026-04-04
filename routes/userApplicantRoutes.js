const {Router} = require("express");
const userMiddleware = require("../middlewares/userAuthMiddleware");
const {applicantProfileController, applicantProfile, applicantJobFetchingController} = require("../controllers/applicantController");
const router = Router();

router.post('/profile', userMiddleware, applicantProfileController);
router.get('/profile', userMiddleware, applicantProfile);
router.get('/jobs', userMiddleware, applicantJobFetchingController);

module.exports = router;