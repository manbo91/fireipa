import admin from "./setup";
import models from "./models";

export const db = admin.firestore();
export const auth = admin.auth();

export default {
  admin,
  db,
  auth,
  models
};
