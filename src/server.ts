import express from "express";

const app = express();

app.get("/", (req, res) => {
  console.log("hello world");
  res.status(200);
  res.json({ message: "hello" });
});

export { app };
