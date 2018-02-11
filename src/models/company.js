import fireipa from "../fireipa";

const rootRef = fireipa.db.collection("company");

const companyModel = new fireipa.models.FireStoreModel(rootRef, {
  name: "stringValue",
  phone: "stringValue",
  address: "stringValue"
});

// const companyLogModel = docId => {
//   const logRef = rootRef.doc(docId).collection("log");
//   return new fireipa.models.FireStoreModel(logRef, {
//     name: "stringValue",
//     updatedAt: "timestampValue",
//     createdAt: "timestampValue"
//   });
// };

const companyLogModel = docId =>
  new fireipa.models.FireStoreDeepModel(
    rootRef,
    docId,
    "log/asdasdnkjasd/asdad",
    {
      name: "stringValue",
      phone: "stringValue",
      address: "stringValue"
    }
  );

export default { companyModel, companyLogModel };
