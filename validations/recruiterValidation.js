const z = require("zod");

const sizesOfCompany = ['0-50', '50-100', '100-250', '250-500', '500-750', '750-1000', '1000+']
const recruiterSchema = z.object({
    nameOfCompany: z.string().min(2),
    companyUrl: z.string(),
    sizesOfCompany: z.enum(sizesOfCompany),
    companyDescription: z.string().min(10),
    industry: z.string(),
    location: z.string()
})

module.exports = recruiterSchema;