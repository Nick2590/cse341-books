import app from "./app.js";

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("The PORT environment variable is required.");
}

app.listen(PORT, () => {
  console.log(`Books API is running on port ${PORT}`);
});