const env = require("dotenv");
env.config({path: '../.env'});
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const recruiterSchema = require("../validations/recruiterValidation");
const User = require("../models/userModel");
const Recruiter = require("../models/recruiterModel");

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

        const JWT_KEY = process.env.JWT_KEY;
        const token = jwt.sign({recruiterId: recruiter._id}, JWT_KEY);

        //marking the user isProfileCreated as true
        await User.findByIdAndUpdate({_id: userId}, {$set: {
            isProfileCreated: true
        }})
        res.status(201).json({
            token,
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

const jobCreationController = async(req, res) => {
    try{
        const userId = req.userId;

        const recruiter = await Recruiter.findOne({userId: userId});

        console.log(recruiter);

        console.log(recruiter._id);

        const recruiterId = recruiter._id;
        const isValidRecruiterId = mongoose.isValidObjectId(recruiterId);

        if(!isValidRecruiterId){
            return res.status(404).json({
                msg: 'RecruiterID does not exist!'
            })
        }

        
    }
    catch(e){
        res.status(500).json({
            error: e.message
        })
    }
}

module.exports = {recruiterProfileController, recruiterProfile};