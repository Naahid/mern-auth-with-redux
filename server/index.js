const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");


require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cookieParser());
app.use(cors())


const mongoUri = process.env.ATLAS_URI;
mongoose.connect(mongoUri)
mongoose.connection.once('open', () => {
    console.log('MongoDB database connected successfully');
})

app.use('/users', require('./routes/users'))




app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});