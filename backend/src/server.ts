import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import authRouter from "./routers/auth";
import pollsRouter from "./routers/polls";
import usersRouter from "./routers/users";
const multer = require('multer');

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.use(express.json());
app.use(bodyParser.json({ limit: '8mb' }));
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/polls", pollsRouter);
app.use("/users", usersRouter);

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get("/", (req: Request, res: Response) => {
  console.log(req.cookies);
  res.status(404).send("no link matched!");
});

export default app;