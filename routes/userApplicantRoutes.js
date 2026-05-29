const {Router} = require("express");
const userMiddleware = require("../middlewares/userAuthMiddleware");
const {applicantProfileController, applicantProfile, applicantJobFetchingController, applicantJobFetchingByIdController, applicantApplyingToAJobById, applicantFetchingAppliedJobs, applicantBookmarkingJobs, applicantFetchingAllBookmarkedJobs} = require("../controllers/applicantController");
const router = Router();

router.post('/profile', userMiddleware, applicantProfileController);
router.get('/profile', userMiddleware, applicantProfile);
router.get('/jobs', userMiddleware, applicantJobFetchingController);
router.get('/jobs/:id', userMiddleware, applicantJobFetchingByIdController);
router.post('/jobs/apply/:id', userMiddleware, applicantApplyingToAJobById);
router.get('/applied-jobs', userMiddleware, applicantFetchingAppliedJobs);
router.post('/bookmarked-jobs/:id', userMiddleware, applicantBookmarkingJobs);
router.get('/bookmarked-jobs', userMiddleware, applicantFetchingAllBookmarkedJobs);

module.exports = router;