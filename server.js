const env = require("dotenv");
env.config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const adminRouter = require("./routes/adminRoutes");

//Function Call to connect the Database URL
const connectDb = require("./config/db")
connectDb();

app.use(bodyParser.json());
app.use('/admin', adminRouter);

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server started at: ${PORT} 🚀`)
})