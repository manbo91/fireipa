import fireipa from "../fireipa";
import models from "./index";

const rootRef = fireipa.db.collection("permission");

/*
  Type of permission
  "owner"
  "editor"
  "viewer"
  "explorer"
*/

const allModels = {};
Object.keys(models).forEach(modelName => {
  allModels[modelName] = "stringValue";
});

const permissionModel = new fireipa.models.FireStoreModel(rootRef, allModels);

export default { permissionModel };

