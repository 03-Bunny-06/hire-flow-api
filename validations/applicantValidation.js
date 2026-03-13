const z = require("zod");

//Applicant Profile Creation Validation
const applicantSchema = z.object({
    name: z.string().min(5),
    educationDetails: z.string().min(5),
    yearOfGraduation: z.number(),
    skills: z.array(z.string()),
    resumeLink: z.string(),
    githubLink: z.string(),
    linkedinLink: z.string()
})


module.exports = applicantSchema;