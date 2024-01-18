import { Request, Response } from 'express';
import connectMongo from '../../../connectMongo';
import userModel from '../../models/userModel';

export default async (req: Request, res: Response) => {
  await connectMongo();
  const { email } = req.body;

  try {
    const candidate = await userModel.findOne({ email });

    if (candidate) {
      const pdfData = candidate.pdfData;
      const base64Data = Buffer.from(pdfData.buffer).toString('base64'); // Convert binary data to base64
      return res.send(base64Data);
    } else {
      return res.status(404).json({ error: 'Candidate not found' });
    }
  } catch (error) {
    console.error('Error retrieving candidate:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
