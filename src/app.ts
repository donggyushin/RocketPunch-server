import Api from "./routes";
import express from "express";
const app = express();

app.use(express.json());

app.use("/api", Api);

export default app;
