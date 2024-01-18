import mongoose from 'mongoose';
const API_KEY = "mongodb://localhost:27017/bbvstest";



const connectMongo = async () =>{ 
    mongoose.set('strictQuery', false);
    await mongoose.connect(API_KEY);}

export default connectMongo;