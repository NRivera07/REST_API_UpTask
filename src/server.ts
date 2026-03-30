import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import auth from "./routes/auth";
import project from "./routes/project";
import { corsConfig } from "./config/cors";
import cors from "cors";

dotenv.config();
connectDB();
const app = express();
app.use(cors(corsConfig));

app.use(express.json());
//Routes
app.use("/api/auth", auth);
app.use("/api/projects", project);

export default app;
