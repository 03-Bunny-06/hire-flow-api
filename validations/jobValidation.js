const z = require("zod");

const yearsOfService = ["0", "1", "2", "3", "4"];
const typesOfEmployement = ['full-time', 'contract', 'internship']
const jobSchema = z.object({
    nameOfCompany: z.string().min(2),
    jobRole: z.string().min(5),
    costToCompany: z.number(),
    openings: z.number(),
    serviceAgreement: z.enum(yearsOfService),
    typeOfEmployement: z.enum(typesOfEmployement),
    applyBy: z.coerce.date(),
    eligibilityCriteria: z.object({
        educationDetails: z.string(),
        minYearOfGraduation: z.number(),
        maxYearOfGraduation: z.number()
    }),
    jobLocation: z.string(),
    skillsRequired: z.array(z.string())
})

const updateJobSchema = jobSchema.partial().extend({
  eligibilityCriteria: jobSchema.shape.eligibilityCriteria.partial().optional()
});

module.exports = {jobSchema, updateJobSchema};