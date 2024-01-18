import { Request, Response } from "express";
import connectMongo from "../../../connectMongo";
import userModel from "../../models/userModel";

export default async (req: Request, res: Response) => {
  await connectMongo();
 
  const { email } = req.body;

  try {
    const updatedCandidate = await userModel.findOneAndUpdate(
      { email },
      { verified: true },
      { new: true }
    );

    if (updatedCandidate) {
      return res.json(updatedCandidate);
    } else {
      return res.status(404).json({ error: "Candidate not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
