const env = require("dotenv");
env.config();
const express = require("express");
const app = express();

//Function Call to connect the Database URL
const connectDb = require("./config/db")
connectDb();

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server started at: ${PORT} 🚀`)
})