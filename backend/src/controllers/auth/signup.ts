import { Request, Response } from "express";
import * as yup from "yup";
import bcrypt from "bcrypt";
import connectMongo from "../../../connectMongo";
import userModel from "../../models/userModel";

const schema = yup.object({
  body: yup.object({
    name: yup.string().min(3).required(),
    email: yup.string().email().required(),
    password: yup.string().min(3).required(),
    citizenshipNumber: yup.string().min(4),
  }),
});

export default async (req: Request, res: Response) => {
    // Connect to MongoDB
    await connectMongo();
  try {
    await schema.validate(req);
  } catch (error: any) {
    return res.status(400).send(error.errors);
  }

  let hashedPassword = undefined;

  try {
    hashedPassword = await bcrypt.hash(req.body.password, 10);
  } catch (error) {
    return res.status(500).send({ error });
  }


  const existingUser = await userModel.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(409).send({ error: "User already exists." });
  }
  const lastUser = await userModel.findOne().sort({ _id: -1 });
  const lastUserId = lastUser?.id;

  const newUser = new userModel();
  newUser.id = lastUserId + 1;
  newUser.admin = false;
  newUser.verified = false;
  newUser.candidate = false;
  newUser.name = req.body.name;
  newUser.email = req.body.email;
  newUser.password = hashedPassword;
  newUser.citizenshipNumber = req.body.citizenshipNumber;


  try {
    const savedUser = await userModel.create(newUser);
    return res.status(200).send({ message: "User created successfully." });
  } catch (error) {
    return res.status(500).send({ error });
  }
};