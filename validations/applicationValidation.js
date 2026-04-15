const z = require("zod");

const applicationSchema = z.object({
    resumeUsed: z.string()
})

module.exports = applicationSchema