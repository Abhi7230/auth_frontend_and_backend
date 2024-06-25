const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({
    path: '/home/abhir/Downloads/OnlineJudge-main/backend/.env'
});

const connectDB = async () => {
    try {
        const MongoDB_URL=process.env.MONGODB_URI;
        await mongoose.connect(MongoDB_URL,{useNewUrlParser:true})
        console.log("Db connection Established");
    } catch (error) {
        console.error('Connection to database failed!', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
