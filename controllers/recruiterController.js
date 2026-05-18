const env = require("dotenv");
env.config({path: '../.env'});
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const recruiterSchema = require("../validations/recruiterValidation");
const {jobSchema, updateJobSchema} = require("../validations/jobValidation");
const User = require("../models/userModel");
const Recruiter = require("../models/recruiterModel");
const Job = require("../models/jobModel");
const Application = require("../models/applicationModel");
const { application } = require("express");

//recruiter controller
const recruiterProfileController = async(req, res) => {
    try{
        const userId = req.userId;
        const name = req.body.name;
        const nameOfCompany = req.body.nameOfCompany;
        const companyUrl = req.body.companyUrl;
        const sizeOfCompany = req.body.sizeOfCompany;
        const companyDescription = req.body.companyDescription;
        const industry = req.body.industry;
        const location = req.body.location;

        const data = {name, nameOfCompany, companyUrl, sizeOfCompany, companyDescription, industry, location};

        const validatedCredentials = recruiterSchema.safeParse(data);

        if(!validatedCredentials.success){
            return res.status(400).json({
                msg: 'Validation Falied',
                error: validatedCredentials.error.message
            })
        }

        const recruiterAlreadyExists = await Recruiter.findOne({userId});

        console.log(recruiterAlreadyExists);

        if(recruiterAlreadyExists){
            return res.status(409).json({
                msg: 'Recruiter cannot be created (recruiter already exists)'
            })
        }

        //creating new recruiter
        const recruiter = await Recruiter.create({userId, ...data});

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

const recruiterProfile = async(req, res) => {
    //get the recruiter profile
    try{
        const userId = req.userId;

        const isValidUserId = mongoose.isValidObjectId(userId);

        if(!isValidUserId){
            return res.status(404).json({
                msg: 'Invalid User ID'
            })
        }

        const recruiter = await Recruiter.findOne({userId: userId});

        console.log(recruiter);

        res.status(200).json({
            profile: recruiter
        })
    }
    catch(e){
        res.status(500).json({
            error: e.message
        })
    }
}

const recruiterJobCreationController = async(req, res) => {
    try{
        const userId = req.userId;

        const recruiter = await Recruiter.findOne({userId: userId});

        console.log(recruiter);

        console.log(recruiter._id);

        const recruiterId = recruiter._id;
        const nameOfCompany = recruiter.nameOfCompany;
        const jobLocation = recruiter.location;
        const isValidRecruiterId = mongoose.isValidObjectId(recruiterId);

        if(!isValidRecruiterId){
            return res.status(404).json({
                msg: 'RecruiterID does not exist!'
            })
        }

        const {
               jobRole, 
               costToCompany, 
               openings, 
               serviceAgreement, 
               typeOfEmployement, 
               applyBy, 
               eligibilityCriteria, 
               skillsRequired} = req.body;
        
        const jobData = {recruiterId,
               nameOfCompany, 
               jobRole, 
               costToCompany, 
               openings, 
               serviceAgreement, 
               typeOfEmployement, 
               applyBy, 
               eligibilityCriteria, 
               jobLocation, 
               skillsRequired};
        
        const validatedCredentials = jobSchema.safeParse(jobData);

        if(!validatedCredentials.success){
            return res.status(400).json({
                msg: 'Validation Failed',
                error: validatedCredentials.error.message
            })
        }

        await Job.create(jobData);
        res.status(201).json({
            msg: 'Job Created successfully!'
        })
    }
    catch(e){
        res.status(500).json({
            error: e.message
        })
    }
}

const recruiterJobFetchingController = async(req, res) => {
    try{
        const userId = req.userId;

        const p = req.query.page;
        const l = req.query.limit;

        const recruiter = await Recruiter.findOne({userId: userId});

        const recruiterId = recruiter._id;

        const isValidRecruiterId = mongoose.isValidObjectId(recruiterId);

        if(!isValidRecruiterId){
            return res.status(404).json({
                msg: 'Invalid Recruiter ID'
            })
        }

        let query = Job.find({recruiterId: recruiterId});

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

        const jobsData = await query;

        res.status(200).json({
            totalJobs: totalJobs,
            msg: "Job data fetched successfully!",
            ...(hasPagination && {
                msg: "Pagination Successful",
                currentPage: page,
                limitForEachPage: limit,
                totalPages: totalPages
            }),
            data: jobsData
        })
    }
    catch(e){
        res.status(500).json({
            error: e.message
        })
    }
}

const recruiterJobFetchingByIdController = async(req, res) => {
    try{
        const userId = req.userId;
        const jobId = req.params.id;

        const recruiter = await Recruiter.findOne({userId: userId});

        const recruiterId = recruiter._id;

        const isValidJobId = mongoose.isValidObjectId(jobId);

        if(!isValidJobId){
            return res.status(404).json({
                msg: 'Invalid Job ID'
            })
        }

        const job = await Job.findOne({recruiterId: recruiterId, _id: jobId});
        if(job === null){
            return res.status(404).json({
                msg: 'Job not Found'
            })
        }

        res.status(404).json({
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

const recruiterJobDeletionByIdController = async(req, res) => {
    try{
        const userId = req.userId;
        const jobId = req.params.id;

        const recruiter = await Recruiter.findOne({userId});

        const recruiterId = recruiter._id;

        const isValidJobId = mongoose.isValidObjectId(jobId);

        if(!isValidJobId){
            return res.status(404).json({
                msg: 'Invalid Job ID'
            })
        }

        const deletedJob =  await Job.findOneAndDelete({recruiterId: recruiterId, _id: jobId});

        console.log(deletedJob);

        if(!deletedJob){
            return res.status(404).json({
                msg: 'Job not found with this Job ID'
            })
        }
        
        res.status(200).json({
            msg: 'Job deleted successfully!'
        })
    }
    catch(e){
        res.status(500).json({
            error: e.message
        })
    }
}

const recruiterJobUpationByIdController = async(req, res) => {
    try{
        const userId = req.userId;
        const jobId = req.params.id;
        
        const updates = req.body;

        const recruiter = await Recruiter.findOne({userId});

        const recruiterId = recruiter._id;

        const isValidJobId = mongoose.isValidObjectId(jobId);

        if(!isValidJobId){
            return res.status(404).json({
                msg: 'Invalid Job ID'
            })
        }
        
        const noOfUpdates = Object.values(updates).length;

        console.log(noOfUpdates);

        const areThereAnyUpdates = noOfUpdates === 0;
        console.log(areThereAnyUpdates);

        if(noOfUpdates === 0){
            return res.status(400).json({
                msg: 'Empty data sent no updates needed!'
            })
        }

        const validatedCredentials = updateJobSchema.safeParse(updates);

        if(!validatedCredentials.success){
            return res.status(400).json({
                msg: 'Validation Falied',
                error: validatedCredentials.error.message
            })
        }

        const updateJob = await Job.findOneAndUpdate({_id:jobId, recruiterId}, {$set: validatedCredentials.data});
        console.log(updateJob);
        res.status(201).json({
            msg: 'Job Updated Successfully!'
        })
    }
    catch(e){
        res.status(500).json({
            error: e.message
        })
    }
}

const recruiterFetchingAllApplications = async(req, res) => {
    const userId = req.userId;
    const recruiter = await Recruiter.findOne({userId});

    console.log(recruiter._id);

    const recruiterId = recruiter._id;

    const jobsIdArray = await Job.distinct('_id', {recruiterId});

    const applications = await Application.find({jobId: {$in: jobsIdArray}});

    console.log(applications.length === 0);

    if(applications.length === 0){
        return res.status(404).json({
            msg: 'No applications'
        })
    }

    res.status(200).json({
        applications: applications
    })

    console.log(applications);
};

const recruiterFetchingSpecificApplication = async(req, res) => {
    const userId = req.userId;
    const applicationId = req.params.id;
    const recruiter = await Recruiter.findOne({userId});

    console.log(recruiter._id);

    const recruiterId = recruiter._id;

    const isValidApplicationId = mongoose.isValidObjectId(applicationId);

    if(!isValidApplicationId){
        return res.status(404).json({
            msg: 'Invalid Application ID'
        })
    }

    const jobsIdArray = await Job.distinct('_id', {recruiterId});
    
    const application = await Application.find({_id:applicationId, jobId: {$in: jobsIdArray}});

    console.log(application);

    if(application === undefined){
        return res.status(404).json({
            msg: 'Application Not Found'
        })
    }

    res.status(200).json({
        application: application
    })
}

const recruiterModifyingtheApplicatonStatus = async(req, res) => {
    const userId = req.userId;
    const typesOfStatus = ['Hiring In Process', 'Hiring Done', 'Selected', 'Rejected'];
    const applicationId = req.params.id;
    const status = req.params.status;
    const recruiter = await Recruiter.findOne({userId});

    console.log(recruiter._id);

    const recruiterId = recruiter._id;

    const jobsIdArray = await Job.distinct('_id', {recruiterId});

    const isValidApplicationId = mongoose.isValidObjectId(applicationId);

    if(!isValidApplicationId){
        return res.status(404).json({
            msg: 'Invalid Application ID'
        })
    }

    const application = applications.find(application => application._id === applicationId);

    console.log(application);

    const isValidStatus = typesOfStatus.includes(status); //true
    const isApplicationExists = (application === undefined); //true

    if(isValidStatus && isApplicationExists){
        const application = await Application.find({_id:applicationId, jobId: {$in: jobsIdArray}, status: {$set: status}}, {new: true});

        return res.status(200).json({
            msg: 'Status modified successfully!',
            application: application
        })
    }

    res.status(404).json({
        msg: 'Invalid Status (or) Application Not Found'
    })
}

//exports for recruiter ->
module.exports = {recruiterProfileController, recruiterProfile, recruiterJobCreationController, recruiterJobFetchingController, recruiterJobFetchingByIdController, recruiterJobDeletionByIdController, recruiterJobUpationByIdController, recruiterFetchingAllApplications, recruiterFetchingSpecificApplication, recruiterModifyingtheApplicatonStatus};