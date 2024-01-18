import { Request, Response } from "express";
import ElectionContract from "../../web3";
import mongoose from "mongoose";
import connectMongo from "../../../connectMongo";


// Define the schema for the election data
const ElectionSchema = new mongoose.Schema({
  name: String,
  description: String,
  votes: Object,
});

// Check if the model has already been compiled before compiling it again
const ElectionModel = mongoose.models.Election || mongoose.model("Election", ElectionSchema);


export default async (req: Request, res: Response) => {
  await connectMongo();

  const instance = await ElectionContract.deployed();
  const name = await instance.getElectionName();
  const description = await instance.getElectionDescription();
  const candidates = await instance.getCandidates();
  const votes = await instance.getVotes();

  const response: any = {};

  for (let i = 0; i < candidates.length; i++) {
    response[candidates[i]] = 0;
  }

  for (let i = 0; i < votes.length; i++) {
    const vote = votes[i];

    if (typeof response[vote[3]] != "undefined")
      response[vote[3]] = response[vote[3]] + 1;
  }

  // Check if name and description are not empty
  if (name && description) {
    // Check if an existing document with the same name and description fields exists
    const existingElection = await ElectionModel.findOne({ name, description }).exec();

    // Update the votes field of the existing document or create a new document with the updated votes field
    if (existingElection) {
      existingElection.votes = response;
      await existingElection.save();
      return res.send(existingElection);
    } else {
      const election = new ElectionModel({ name, description, votes: response });
      await election.save();
      return res.send({ name, description, votes: response });
    }
  } else {
    // Return an empty response if name or description is empty
    return res.send({ name, description, votes: response });
  }
};
