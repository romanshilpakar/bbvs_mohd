import { Request, Response } from "express";
import connectMongo from "../../../connectMongo";
import userModel from "../../models/userModel";

export default async (req: Request, res: Response) => {
  await connectMongo();

  try {
    const candidates = await userModel.find({candidate: true });
    return res.json(candidates);
  } catch (error) {
    console.error("Error retrieving candidates:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
