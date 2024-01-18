import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
    id: Number,
    name: String,
    citizenshipNumber: String,
    email: String,
    password: String,
    profileImage: String,
    admin: Boolean,
    candidate: Boolean,
    verified: Boolean,
    pdfData: Buffer,
  }
  , { strict: false }
  );
  
  const userModel = models.userModel || model('userModel', userSchema,'userModel');
  
  export default userModel;