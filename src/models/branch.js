import fireipa from "../fireipa";

const branchRef = fireipa.db.collection("branch");

const branchModel = new fireipa.models.FireStoreTimestampModel(branchRef, {
  name: "stringValue",
  phone: "stringValue",
  address: "stringValue",
  asdasd: "stringValue",
  createdAt: "timestampValue",
  updatedAt: "timestampValue"
});

export default { branchModel };
