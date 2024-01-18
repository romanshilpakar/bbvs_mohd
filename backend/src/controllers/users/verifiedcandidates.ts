import { Request, Response } from "express";
import connectMongo from "../../../connectMongo";
import userModel from "../../models/userModel";

export default async (req: Request, res: Response) => {
  await connectMongo();

  try {
    const verifiedCandidates = await userModel.find({ candidate: true, verified: true });
    return res.json(verifiedCandidates);
  } catch (error) {
    console.error("Error retrieving candidates:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
