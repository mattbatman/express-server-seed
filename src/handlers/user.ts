import { prisma } from "../db";
import { hashPassword, createJWT, comparePasswords } from "../modules/auth";

const createNewUser = async (req, res, next) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: await hashPassword(req.body.password),
      },
    });

    res.redirect("/account");
  } catch (err) {
    return next(err);
  }
};

const apiCreateNewUser = async (req, res) => {
  const user = await prisma.user.create({
    data: {
      username: req.body.username,
      password: await hashPassword(req.body.password),
    },
  });

  const token = createJWT(user);

  res.json({ token });
};

const apiSignin = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });

  const isValid = await comparePasswords(req.body.password, user.password);

  if (!isValid) {
    res.status(401);
    res.json({ message: "invalid credentials" });
    return;
  }

  const token = createJWT(user);

  res.json({ token });
};

const signin = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });

  const isValid = await comparePasswords(req.body.password, user.password);

  if (!isValid) {
    res.status(401);
    res.redirect("/");
    return;
  }

  res.redirect("/account");
};

export { createNewUser, apiCreateNewUser, apiSignin, signin };
