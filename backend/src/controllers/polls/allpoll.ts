import { Request, Response } from "express";
import mongoose from "mongoose";
import connectMongo from "../../../connectMongo";


// Define the schema for the election data
const ElectionSchema = new mongoose.Schema({
  name: String,
  description: String,
  votes: Object,
});

// Check if the model has already been compiled
const ElectionModel = mongoose.models.Election || mongoose.model("Election", ElectionSchema);

export default async (req: Request, res: Response) => {
  await connectMongo();

  const elections = await ElectionModel.find({}).exec();

  return res.json(elections);
};
