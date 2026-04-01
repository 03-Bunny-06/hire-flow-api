const {Router} = require("express");
const userMiddleware = require("../middlewares/userAuthMiddleware");
const {recruiterProfileController, recruiterProfile, jobCreationController, jobFetchingController, jobFetchingByIdController, jobDeletionByIdController, jobUpationByIdController} = require("../controllers/recruiterController")
const router = Router();

router.post('/profile', userMiddleware, recruiterProfileController);
router.get('/profile', userMiddleware, recruiterProfile);
router.post('/jobs', userMiddleware, jobCreationController);
router.get('/jobs', userMiddleware, jobFetchingController);
router.get('/jobs/:id', userMiddleware, jobFetchingByIdController);
router.delete('/jobs/:id', userMiddleware, jobDeletionByIdController);
router.patch('/jobs/:id', userMiddleware, jobUpationByIdController);

module.exports = router;