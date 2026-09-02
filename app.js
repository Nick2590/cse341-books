import express from "express";
import { getDb } from "./src/db/connect.js";

const app = express();

app.use(express.json());

app.get("/", (request, response) => {
  response.status(200).json({ message: "Books API is running" });
});

app.get("/trails", async (request, response) => {
  const database = getDb();
  const trails = await database.collection("trails").find().toArray();
  return response.status(200).json(trails);
});

export default app;