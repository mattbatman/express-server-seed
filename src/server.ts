import express from "express";
import morgan from "morgan";
import cors from "cors";
import { router } from "./router";
import { protect } from "./modules/auth";
import { apiCreateNewUser, apiSignin } from "./handlers/user";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("hello world");
  res.status(200);
  res.json({ message: "hello" });
});

app.post("/api/user", apiCreateNewUser);
app.post("/api/signin", apiSignin);
app.use("/api/user", protect, router);

export { app };
