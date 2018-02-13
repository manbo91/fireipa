import models from "../models";
import { baseRouter } from "./js/base";


/**
 * GET home page
 */

const router = baseRouter(models.branch.branchModel, true);

router.get("/test/test", (req, res) => {
  res.status(200).send("test good");
});

export default router;
