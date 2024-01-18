import { Request, Response } from "express";
import * as yup from "yup";
import userModel from "../../models/userModel";
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import connectMongo from "../../../connectMongo";


const schema = yup.object({
  body: yup.object({
    email: yup.string().email().required(),
  }),
});

const forgotPasswordSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expiryDate: { type: Date, required: true },
});

const ForgotPasswordModel = mongoose.models.ForgotPassword || mongoose.model('ForgotPassword', forgotPasswordSchema);

export default async (req: Request, res: Response) => {
  let user = null;
  try {
    await schema.validate(req);
  } catch (error: any) {
    return res.status(400).send(error.errors);
  }
  await connectMongo();
  // throws error if user with provided email not found
  try {
    user = await userModel.findOne({ email: req.body.email });
  } catch (error: any) {
    return res.status(404).send(error);
  }

  const token = uuidv4();
  const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
  
  // Check if the email already exists in the ForgotPassword collection
  const filter = { email: user.email };
  const update = { token, expiryDate };
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  let forgotPasswordDoc = null;
  try {
    forgotPasswordDoc = await ForgotPasswordModel.findOneAndUpdate(filter, update, options);
  } catch (error: any) {
    return res.status(500).send(error);
  }
  
  // Send the password reset link to the user's email
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "khwopamajorproject@gmail.com", // replace with your email address
      pass: "mtrgrryuysuajjvl", // replace with your email password
    },
  });

  const resetLink = `http://localhost:3000/resetpassword/${token}`;
  const mailOptions = {
    from: "khwopamajorproject@gmail.com",
    to: user.email,
    subject: "Password Reset Link",
    text: `Please click on the following link to reset your password: ${resetLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    return res.status(500).send(error);
  }

  
  return res.send({ success: true });
};
