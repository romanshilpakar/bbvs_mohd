import { Request, Response } from "express";
import ElectionContract from "../../web3";
import mongoose from "mongoose";
import connectMongo from "../../../connectMongo";
import userModel from "../../models/userModel";


// Define the schema for the election data
const ElectionSchema = new mongoose.Schema({
  name: String,
  description: String,
  votes: Object,
  profileImages: Object,
  electionStarted: Boolean,
  startDate:Date,
  endDate:Date,
  completed:Boolean,

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
  // console.log("name:",name)
  // console.log("description:",description)

  const response: any = {};

  for (let i = 0; i < candidates.length; i++) {
    response[candidates[i]] = 0;
  }

  for (let i = 0; i < votes.length; i++) {
    const vote = votes[i];

    if (typeof response[vote[3]] != "undefined")
      response[vote[3]] = response[vote[3]] + 1;
  }

  const userProfiles = await userModel.find({ name: { $in: candidates } }, { name: 1, profileImage: 1 });

  const profileImages: { [key: string]: string } = {};
  userProfiles.forEach((profile) => {
    profileImages[profile.name] = profile.profileImage;
  });

  // console.log("profileImages:",profileImages)


  // Check if name and description are not empty
  if (name && description) {
    // Check if an existing document with the same name and description fields exists
    const existingElection = await ElectionModel.findOne({ name, description }).exec();
    // console.log("response:",response)

    // Update the votes field of the existing document or create a new document with the updated votes field
    if (existingElection) {
      existingElection.votes = response;
      existingElection.profileImages = profileImages;
      await existingElection.save();
     
      return res.send(existingElection);
    } else {
      const election = new ElectionModel({ name, description, votes: response,profileImages });
      await election.save();
     
      return res.send({ name, description, votes: response,profileImages });
    }
  } else {
    // Return an empty response if name or description is empty
   
    return res.send({ name, description, votes: response,profileImages });
  }
};
