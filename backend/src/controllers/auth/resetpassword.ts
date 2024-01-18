import { Request, Response } from "express";
import * as yup from "yup";
import userModel from "../../models/userModel";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import connectMongo from "../../../connectMongo";


const schema = yup.object({
  body: yup.object({
    password: yup.string().min(3).required(),
    confirm: yup.string().min(3).required(),
  }),
  params: yup.object({
    token: yup.string().required(),
  }),
});

const forgotPasswordSchema = new mongoose.Schema({
    email: { type: String, required: true },
    token: { type: String, required: true },
    expiryDate: { type: Date, required: true },
  });
  
  const ForgotPasswordModel =
    mongoose.models.ForgotPassword ||
    mongoose.model("ForgotPassword", forgotPasswordSchema);
  

export default async (req: Request, res: Response) => {
    const { password } = req.body;
    const { token } = req.params;

  // Check if token is undefined
  if (!token) {
    return res.status(400).send("Token is required.");
  }

  try {
    await schema.validate(req);
  } catch (error: any) {
    return res.status(400).send(error.errors);
  }
  await connectMongo();

  // Find the user associated with the provided token
  let forgotPasswordDoc = null;
  try {
    forgotPasswordDoc = await ForgotPasswordModel.findOne({ token });
  } catch (error: any) {
    return res.status(500).send(error);
  }

  if (!forgotPasswordDoc) {
    return res.status(404).send("Invalid or expired token.");
  }

  // Check if the token has expired
  if (forgotPasswordDoc.expiryDate.getTime() < Date.now()) {
    return res.status(400).send("Token has expired.");
  }

  // Find the user associated with the provided email
  let user = null;
  try {
    user = await userModel.findOne({ email: forgotPasswordDoc.email });
  } catch (error: any) {
    return res.status(500).send(error);
  }

   // Hash the new password and update the user's password
   const salt = await bcrypt.genSalt();
   const hashedPassword = await bcrypt.hash(password, salt);
 
   user.password = hashedPassword;
 
   try {
     await user.save();
     // Delete the document associated with the user's email
  await ForgotPasswordModel.deleteOne({ email: user.email });
   } catch (error: any) {
     return res.status(500).send(error);
   }
   return res.send({ success: true });
};
