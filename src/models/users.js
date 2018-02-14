import fireipa from "../fireipa";

const rootRef = fireipa.db.collection("users");

const userModel = new fireipa.models.FireStoreModel(rootRef, {
  displayName: "stringValue",
  email: "stringValue",
});

export default { userModel };
