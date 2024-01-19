import { Request, Response } from "express";
import * as yup from "yup";
import ElectionContract, { web3 } from "../../web3";
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

});

// Check if the model has already been compiled before compiling it again
const ElectionModel = mongoose.models.Election || mongoose.model("Election", ElectionSchema);

const schema = yup.object({
  body: yup.object({
    name: yup.string().min(3).required(),
    description: yup.string().min(10).required(),
    candidates: yup.array(
      yup.object({
        name: yup.string().min(3),
      })
    ),
  }),
});

export default async (req: Request, res: Response) => {
  try {
    await schema.validate(req);
  } catch (error: any) {
    return res.status(400).send(error.errors);
  }

  const instance = await ElectionContract.deployed();

  const status = await instance.getStatus();
  // if (status !== "not-started")
  //   return res.status(400).send("election already started or not reset");

  const accounts = await web3.eth.getAccounts();

  await instance.setElectionDetails(req.body.name, req.body.description, {
    from: accounts[0],
  });

  for (let i = 0; i < req.body.candidates.length; i++) {
    const candidate = req.body.candidates[i];
    await instance.addCandidate(candidate.name, {
      from: accounts[0],
    });
  }

  await instance.addCandidate("NOTA", {
    from: accounts[0],
  });

  const election = new ElectionModel({ name: req.body.name, description : req.body.description , electionStarted: false ,startDate:req.body.startDate, endDate: req.body.endDate });
  await election.save();

  

  return res.send(req.body);
};
