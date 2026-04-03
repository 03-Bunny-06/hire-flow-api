const applicantSchema = require("../validations/applicantValidation");

const Applicant = require("../models/applicantModel");

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
    }
    catch(e){
        res.status(500).json({
            error: e.message
        })
    }
}