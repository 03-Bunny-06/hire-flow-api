const {Router} = require("express");
const userMiddleware = require("../middlewares/userAuthMiddleware");
const {recruiterProfileController, recruiterProfile, recruiterJobCreationController, recruiterJobFetchingController, recruiterJobFetchingByIdController, recruiterJobDeletionByIdController, recruiterJobUpationByIdController} = require("../controllers/recruiterController")
const router = Router();

router.post('/profile', userMiddleware, recruiterProfileController);
router.get('/profile', userMiddleware, recruiterProfile);
router.post('/jobs', userMiddleware, recruiterJobCreationController);
router.get('/jobs', userMiddleware, recruiterJobFetchingController);
router.get('/jobs/:id', userMiddleware, recruiterJobFetchingByIdController);
router.delete('/jobs/:id', userMiddleware, recruiterJobDeletionByIdController);
router.patch('/jobs/:id', userMiddleware, recruiterJobUpationByIdController);

module.exports = router;