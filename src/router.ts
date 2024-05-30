import { Router } from "express";

const router = Router();

router.get("/:id", (req, res) => {
  res.json({ hello: "world" });
});

export { router };
