import express from "express";
import env from "dotenv";
import cors from "cors";
import { client } from "./client.js";

env.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

client();

export default app;
