import fireipa from "../fireipa";

const rootRef = fireipa.db.collection("branch");

const branchModel = new fireipa.models.FireStoreTimestampModel(rootRef, {
  name: "stringValue",
  phone: "stringValue",
  address: "stringValue",
  createdAt: "timestampValue",
  updatedAt: "timestampValue"
});

export default { branchModel };
