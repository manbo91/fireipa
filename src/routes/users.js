import { Router } from 'express';
import models from '../models';

const router = Router();


/**
 * GET home page
 */

router.get("/", async (req, res) => {
  const data = await models.branch.get("mZyYSkmsWxQwTRoYklnl");
  if (!data) {
    res.sendStatus(404);
  } else {
    res.status(200).send(data);
  }
});

router.get("/all", async (req, res) => {
  const data = await models.branch.branchModel.getAll();
  if (!data) {
    res.sendStatus(404);
  } else {
    res.status(200).send(data);
  }
});

router.post("/", async (req, res) => {
  // console.log(req.body);
  // const addedData = await branch.add(req.body);
  try {
    const docId = await models.branch.branchModel.add(req.body);
    // const docId3 = await models.branch.branchModel.update("seungyeon", req.body);
    // const docId4 = await models.company.companyLogModel("12asdasd3").add(req.body);
    if (!docId) {
      res.sendStatus(400);
    } else {
      res.status(201).send(docId);
    }
  } catch (e) {
    res.status(500).send(e);
    console.error(e);
  }
});

export default router;
