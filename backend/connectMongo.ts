import mongoose from 'mongoose';
const API_KEY = "mongodb+srv://admin:admin@cluster0.ofxuauf.mongodb.net/bbvs";



const connectMongo = async () =>{ 
    mongoose.set('strictQuery', false);
    await mongoose.connect(API_KEY);}

export default connectMongo;