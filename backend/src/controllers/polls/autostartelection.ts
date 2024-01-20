import mongoose from "mongoose";
import ElectionContract, { web3 } from "../../web3";
import { Request, Response } from "express";



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

  export default async (_: Request, res: Response) => {
    
    const instance = await ElectionContract.deployed();
    const name = await instance.getElectionName();
    const description = await instance.getElectionDescription();
  
    const existingElection = await ElectionModel.findOne({ name, description }).exec();
    if (existingElection) {
      existingElection.electionStarted = true;
      await existingElection.save();
    return res.send("Election AutoStart");

    } 
    return res.send("Election AutoStart Failed");
  };