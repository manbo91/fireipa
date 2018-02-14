import fireipa from "../fireipa";

const rootRef = fireipa.db.collection("usersTest");

const usersModel = new fireipa.models.FireStoreModel(rootRef, {
  displayName: "stringValue",
  email: "stringValue",
});

export default { usersModel };
