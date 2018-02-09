import { Router } from 'express';

const router = Router();

/**
 * GET home page
 */

router.get("/", (req, res) => {
  res.status(200).send("ok");
});

export default router;
