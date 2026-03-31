const {Router} = require("express");
const userMiddleware = require("../middlewares/userAuthMiddleware");
const {recruiterProfileController, recruiterProfile, jobCreationController, jobFetchingController, jobFetchingByIdController} = require("../controllers/recruiterController")
const router = Router();

router.post('/profile', userMiddleware, recruiterProfileController);
router.get('/profile', userMiddleware, recruiterProfile);
router.post('/jobs', userMiddleware, jobCreationController);
router.get('/jobs', userMiddleware, jobFetchingController);
router.get('/jobs/:id', userMiddleware, jobFetchingByIdController);

module.exports = router;