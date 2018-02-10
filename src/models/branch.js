import fireipa from "../fireipa";

const branchRef = fireipa.db.collection("branch");

const branchModel = new fireipa.models.FireStoreModel(branchRef, {
  name: "stringValue",
  phone: "stringValue",
  address: "stringValue",
  asdasd: "stringValue"
});

export default { branchModel };
