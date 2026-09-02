import express from "express";

const app = express();

app.use(express.json());

app.get("/", (request, response) => {
  response.status(200).json({ message: "Books API is running" });
});

export default app;