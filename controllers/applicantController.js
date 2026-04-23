const mongoose = require("mongoose");
const applicantSchema = require("../validations/applicantValidation");
const applicationSchema = require("../validations/applicationValidation");

const User = require("../models/userModel");
const Applicant = require("../models/applicantModel");
const Application = require("../models/applicationModel");
const Job = require("../models/jobModel");

//profile creation
const applicantProfileController = async(req, res) => {
    try{
        const userId = req.userId;
        const name = req.body.name;
        const educationDetails = req.body.educationDetails;
        const yearOfGraduation = req.body.yearOfGraduation;
        const skills = req.body.skills;
        const resumeLink = req.body.resumeLink;
        const githubLink = req.body.githubLink;
        const linkedinLink = req.body.linkedinLink;

        const data = {name, educationDetails, yearOfGraduation, skills, resumeLink, githubLink, linkedinLink};

        const validatedCredentials = applicantSchema.safeParse(data);

        console.log(validatedCredentials);

        if(!validatedCredentials.success){
            return res.status(400).json({
                msg: 'Validation Falied',
                error: validatedCredentials.error.message
            })
        }

        const applicantAlreadyExists = await Applicant.findOne({userId: userId});

        if(applicantAlreadyExists){
            return res.status(409).json({
                msg: 'Applicant cannot be created (applicant already exists)'
            })
        }

        console.log(applicantAlreadyExists);

        //creating an applicant
        const applicant = await Applicant.create({userId, ...data});

        //marking the user isProfileCreated as true
        await User.findByIdAndUpdate({_id: userId}, {$set: {
            isProfileCreated: true
        }})
        res.status(201).json({
            msg: 'Recruiter Profile created successfully!'
        })
    }
    catch(e){
        res.status(500).json({
            error: e.message
        })
    }
}

//profile fetching
const applicantProfile = async(req, res) => {
    try{
        const userId = req.userId;
        
        const isValidUserId = mongoose.isValidObjectId(userId);
        
        if(!isValidUserId){
            return res.status(404).json({
                msg: 'Invalid User ID'
            })
        }

        const applicant = await Applicant.findOne({userId: userId});

        res.status(200).json({
            profile: applicant
        })
    }
    catch(e){
        res.status(500).json({
            error: e.message
        })
    }
}

//job fetching
const applicantJobFetchingController = async(req, res) => {
    try{
        const userId = req.userId;
        const p = req.query.page;
        const l = req.query.limit;

        const applicant = await Applicant.findOne({userId: userId});

        const applicantName = applicant.name;

        let query = Job.find({});

        const hasPagination = !!(p || l);

        let page, limit, totalJobs, totalPages;

        if(hasPagination){
            page = Math.max(1, Number(p));
            limit = Math.max(5, Number(l));
            
            totalJobs = await Job.countDocuments({});
            totalPages = Math.ceil(totalJobs/limit);

            if(page > totalPages && totalJobs > 0){
                return res.status(404).json({
                    msg: 'Page does not exist'
                })
            }

            const skip = (page - 1) * limit;
            console.log(skip);

            query = query.skip(skip).limit(limit);
        }

        const jobs = await query;

        console.log(`${applicantName} is fetching jobs!`);

        res.status(200).json({
            msg: "Job data fetched successfully!",
            ...(hasPagination && {
                msg: 'Pagination Successful',
                currentPage: page,
                limitForEachPage: limit,
                totalPages: totalPages
            }),
            data: jobs
        })
    }
    catch(e){
        res.status(500).json({
            error: e.message
        })
    }
}

//job fetching by id //
const applicantJobFetchingByIdController = async(req, res) => {
    try{
        const userId = req.userId;
        const jobId = req.params.id;

        const applicant = await Applicant.findOne({userId: userId});

        const isValidJobId = mongoose.isValidObjectId(jobId);

        if(!isValidJobId){
            return res.status(404).json({
                msg: 'Invalid Job ID'
            })
        }

        const applicantName = applicant.name;
        console.log(`${applicantName} have fetched a job!`);

        const job = await Job.findById(jobId);
        if(job === null){
            return res.status(404).json({
                msg: 'Job not Found'
            })
        }

        return res.status(200).json({
            msg: 'Job data fetched successfully!',
            data: job
        })
    }
    catch(e){
        res.status(500).json({
            error: e.message
        })
    }
}

//applying for job
const applicantApplyingToAJobById = async(req, res) => {
    try{
        const userId = req.userId;
        const jobId = req.params.id;

        const resumeUsed = req.body.resumeUsed;

        const applicant = await Applicant.findOne({userId: userId});
        const applicantId = applicant._id;

        const isValidJobId = mongoose.isValidObjectId(applicantId);

        if(!isValidJobId){
            return res.status(404).json({
                msg: 'Invalid Job ID'
            })
        }

        const job = await Job.findById(jobId);

        if(!job){
            return res.status(404).json({
                msg: 'Job not found'
            })
        }

        const data = {resumeUsed};

        const validatedCredentials = applicationSchema.safeParse(data);

        if(!validatedCredentials.success){
            return res.status(400).json({
                msg: 'Validation Falied',
                error: validatedCredentials.error.message
            })
        }

        const applicantAlreadyApplied = await Application.findOne({applicantId: applicantId, jobId: jobId});

        console.log(applicantAlreadyApplied);

        //flow to handle already applied
        if(applicantAlreadyApplied){
            return res.status(409).json({
                msg: 'Applicant already applied for this job please try applying to a other jobs'
            })
        }

        const {eligibilityCriteria} = job;

        const applicantDegree = applicant.educationDetails;
        const splittedApplicantDegree = applicant.educationDetails.split("(")[0];
        console.log(applicantDegree);
        console.log(splittedApplicantDegree);

        //checking eligibility criteria
        const isEducationValid = eligibilityCriteria.educationDetails.includes(applicantDegree) || eligibilityCriteria.educationDetails.includes(splittedApplicantDegree);
        console.log(isEducationValid);

        const isYearValid = applicant.yearOfGraduation >= eligibilityCriteria.minYearOfGraduation && applicant.yearOfGraduation <= eligibilityCriteria.maxYearOfGraduation;
        console.log(isYearValid);

        const isEligible = isEducationValid && isYearValid;
        console.log(isEligible);

        if(!isEligible){
            return res.status(400).json({
                msg: "You are not eligible for this job"
            })
        }

        const application = await Application.create({applicantId, jobId, resumeUsed});
        res.status(201).json({
            msg: 'Applied successfully!',
            application
        })
    }
    catch(e){
        res.status(500).json({
            error: e.message
        })
    }
};

module.exports = {applicantProfileController, applicantProfile, applicantJobFetchingController, applicantJobFetchingByIdController, applicantApplyingToAJobById};