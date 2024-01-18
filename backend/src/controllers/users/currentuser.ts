import { Request, Response } from "express";
import connectMongo from "../../../connectMongo";
import userModel from "../../models/userModel";

export default async (req: Request, res: Response) => {
  await connectMongo();
  const userEmail = req.query.email as string;
//   console.log("userEmail:",userEmail)

  try {
    const user = await userModel.findOne({ email: userEmail });
    return res.json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
