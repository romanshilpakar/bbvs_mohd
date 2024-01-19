import { Request, Response } from "express";
import ElectionContract, { web3 } from "../../web3";
import memoryCache from "memory-cache";
import mongoose from "mongoose";

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
  const accounts = await web3.eth.getAccounts();
  const instance = await ElectionContract.deployed();
  const name = await instance.getElectionName();
  const description = await instance.getElectionDescription();

  const status = await instance.getStatus();

  if (status !== "running") return res.status(400).send("election not started");

  await instance.endElection({ from: accounts[0] });

  const votes = await instance.getVotes();
  const existingElection = await ElectionModel.findOne({ name, description }).exec();
  if (existingElection) {
    existingElection.completed = true;
    await existingElection.save();

  }

  memoryCache.clear();

  return res.send({ votes });
};
