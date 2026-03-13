const z = require("zod");

const typesOfStatus = ['Applied', 'Hiring In Process', 'Hiring Done', 'Selected']
const applicationSchema = z.object({
    resumeUsed: z.string(),
    status: z.enum(typesOfStatus)
})

module.exports = applicationSchema