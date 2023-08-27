const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Successfully connected to database !');
    } catch(error) {
        console.log('Error connecting to database: ', error);
    }
};

module.exports = { connectDatabase };