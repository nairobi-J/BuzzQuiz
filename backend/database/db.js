// db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @description Establishes a connection to the MongoDB database.
 * @returns {Promise<void>} A promise that resolves when the connection is successful.
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;
