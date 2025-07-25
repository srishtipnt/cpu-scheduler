import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://digambermehta2603:digamber09812@cluster0.hshux.mongodb.net/");
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
    };
 
export default connectDB;