import { Request, Response } from "express";
import connectMongo from "../../../connectMongo";
import userModel from "../../models/userModel";

export default async (req: Request, res: Response) => {
  await connectMongo();

  try {
    const users = await userModel.find({ admin: false, candidate: false });
    return res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
