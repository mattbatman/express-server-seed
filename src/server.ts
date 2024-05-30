import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { router } from "./router";
import { protect } from "./modules/auth";
import { apiCreateNewUser, apiSignin } from "./handlers/user";

const app = express();

app.set("views", __dirname);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.render("index");
});

app.post("/api/user", apiCreateNewUser);
app.post("/api/signin", apiSignin);
app.use("/api/user", protect, router);

export { app };
