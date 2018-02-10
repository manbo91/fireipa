import admin from "./setup";
import models from "./models";

const db = admin.firestore();
const auth = admin.auth();

export default {
  admin,
  db,
  auth,
  models
};
