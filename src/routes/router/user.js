import { Router } from "express";
import fireipa from "../../fireipa";
import { checkToken, doPrivate, doPrivateDoc, ADMIN_ID } from "./shared";

const router = Router();

function userRouter(model, apiPrivate) {
  let userId;
  router.all("*", async (req, res, next) => {
    if (apiPrivate) {
      userId = await checkToken(req);
      if (userId) {
        next();
      } else {
        res.sendStatus(401);
      }
    } else {
      next();
    }
  });

  router
    .route("/")
    .get(async (req, res) => {
      doPrivate(res, userId === ADMIN_ID, async () => {
        let data;
        if (req.query) {
          const { field, offset, limit } = req.query;
          if ((field && limit) || offset) {
            data = await model.getPage(req.query);
          } else {
            data = await model.getFilter(req.query);
          }
        } else {
          data = await model.getAll();
        }

        if (!data) {
          res.sendStatus(404);
        } else {
          res.status(200).send(data);
        }
      });
    })
    .post((req, res) => {
      const { email, password, displayName } = req.body;
      fireipa.auth
        .createUser({ email, password, displayName })
        .then(async userRecord => {
          console.log("Successfully created new user:", userRecord.uid);

          const docId = await model.create(userRecord.uid, {
            ...req.body,
            password: undefined
          });

          if (!docId) {
            res.sendStatus(400);
          } else {
            res.status(201).send(docId);
          }
        })
        .catch(error => res.status(403).send(error.errorInfo));
    });

  router.get("/search", async (req, res) => {
    doPrivate(res, userId === ADMIN_ID, async () => {
      if (req.query) {
        const data = await model.getSearch(req.query);

        if (!data) {
          res.sendStatus(404);
        } else {
          res.status(200).send(data);
        }
      } else {
        res.sendStatus(400);
      }
    });
  });

  router
    .route("/:docId")
    .get(async (req, res) => {
      doPrivateDoc(res, req.params.docId, userId, apiPrivate, async () => {
        const data = await model.get(req.params.docId);

        if (!data) {
          res.sendStatus(404);
        } else {
          res.status(200).send(data);
        }
      });
    })
    .put(async (req, res) => {
      doPrivateDoc(res, req.params.docId, userId, apiPrivate, async () => {
        const docId = await model.update(req.params.docId, req.body);

        if (!docId) {
          res.sendStatus(404);
        } else {
          res.status(201).send(docId);
        }
      });
    })
    .post(async (req, res) => {
      doPrivateDoc(res, req.params.docId, userId, apiPrivate, async () => {
        const docId = await model.create(req.params.docId, req.body);

        if (!docId) {
          res.sendStatus(400);
        } else {
          res.status(201).send(docId);
        }
      });
    })
    .delete(async (req, res) => {
      doPrivateDoc(res, req.params.docId, userId, apiPrivate, async () => {
        const docId = await model.delete(req.params.docId);

        if (!docId) {
          res.sendStatus(400);
        } else {
          res.status(200).send(docId);
        }
      });
    });

  return router;
}

export default userRouter;
