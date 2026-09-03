import express from "express";
import router from "./src/router.js";

const app = express();

app.use(express.json());
app.use(router);

app.get("/", (request, response) => {
  return response.status(200).json({ message: "Books API is running" });
});

export default app;