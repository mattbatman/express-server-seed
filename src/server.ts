import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import { comparePasswords } from "./modules/auth";
import { prisma } from "./db";
import { router } from "./router";
import { protect } from "./modules/auth";
import { createNewUser, apiCreateNewUser, apiSignin } from "./handlers/user";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const isValid = await comparePasswords(password, user.password);

      if (!isValid) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

const browserSession = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
});

const passportSession = passport.session();

const app = express();

app.set("views", __dirname);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", browserSession, passportSession, (req, res) => {
  return res.render("index");
});

app.get("/sign-up", browserSession, passportSession, (req, res) =>
  res.render("sign-up-form")
);

app.post("/sign-up", browserSession, passportSession, createNewUser);

app.get("/log-in", browserSession, passportSession, (req, res) =>
  res.render("log-in-form")
);

app.post(
  "/log-in",
  browserSession,
  passportSession,
  passport.authenticate("local", {
    successRedirect: "/account",
    failureRedirect: "/",
  })
);

app.get("/log-out", browserSession, passportSession, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/account", browserSession, passportSession, (req, res) => {
  return res.render("account", { user: req.user });
});

app.post("/api/user", apiCreateNewUser);
app.post("/api/signin", apiSignin);
app.use("/api/user", protect, router);

export { app };
