import { Router } from "express";
import models from "../models";

const router = Router();

/**
 * GET home page
 */

router
  .route("/")
  .get(async (req, res) => {
    let data;

    if (req.query) {
      const { field, offset, limit } = req.query;
      if ((field && limit) || offset) {
        data = await models.branch.branchModel.getPage(req.query);
      } else {
        data = await models.branch.branchModel.getFilter(req.query);
      }
    } else {
      data = await models.branch.branchModel.getAll();
    }

    if (!data) {
      res.sendStatus(404);
    } else {
      res.status(200).send(data);
    }
  })
  .post(async (req, res) => {
    const docId = await models.branch.branchModel.add(req.body);

    if (!docId) {
      res.sendStatus(400);
    } else {
      res.status(201).send(docId);
    }
  });

router
  .route("/:docId")
  .get(async (req, res) => {
    const data = await models.branch.branchModel.get(req.params.docId);

    if (!data) {
      res.sendStatus(404);
    } else {
      res.status(200).send(data);
    }
  })
  .put(async (req, res) => {
    const docId = await models.branch.branchModel.update(
      req.params.docId,
      req.body
    );

    if (!docId) {
      res.sendStatus(404);
    } else {
      res.status(201).send(docId);
    }
  })
  .post(async (req, res) => {
    const docId = await models.branch.branchModel.create(
      req.params.docId,
      req.body
    );

    if (!docId) {
      res.sendStatus(400);
    } else {
      res.status(201).send(docId);
    }
  })
  .delete(async (req, res) => {
    const docId = await models.branch.branchModel.delete(req.params.docId);

    if (!docId) {
      res.sendStatus(400);
    } else {
      res.status(200).send(docId);
    }
  });

export default router;
