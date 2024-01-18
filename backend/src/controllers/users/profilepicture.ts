import { Request, Response } from "express";
import connectMongo from "../../../connectMongo";
import userModel from "../../models/userModel";

export default async (req: Request, res: Response) => {
  await connectMongo();

  const existingUser = await userModel.findOne({ email: req.body.email });
  if (!existingUser) {
    return res.status(409).send({ error: "User not found." });
  }

  try {
    const updatedCandidate = await userModel.findOneAndUpdate(
      { email:req.body.email },
      { profileImage: req.body.profileImage },
      { new: true }
    );

    if (updatedCandidate) {
      return res.json(updatedCandidate);
    } else {
      return res.status(404).json({ error: "Candidate not updated" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
