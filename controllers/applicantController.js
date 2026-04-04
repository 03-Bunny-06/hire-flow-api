const mongoose = require("mongoose");
const applicantSchema = require("../validations/applicantValidation");

const User = require("../models/userModel");
const Applicant = require("../models/applicantModel");
const Job = require("../models/jobModel");

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

        await User.findByIdAndUpdate({_id: userId}, {$set: {
                isProfileCreated: true
            }
        })
        res.status(201).json({
            msg: "Applicant Profile created successfully!"
        })
    }
    catch(e){
        res.status(500).json({
            error: e.message
        })
    }
}

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

const applicantJobFetchingController = async(req, res) => {
    try{
        const userId = req.userId;

        const applicant = await Applicant.findOne({userId: userId});

        const applicantName = applicant.name;

        const jobs = await Job.find({});

        console.log(`${applicantName} is fetching jobs!`);

        res.status(200).json({
            data: jobs
        })
    }
    catch(e){
        res.status(500).json({
            error: e.message
        })
    }
}

module.exports = {applicantProfileController, applicantProfile, applicantJobFetchingController};