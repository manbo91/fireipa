import admin from "firebase-admin";
import serviceAccount from "./key/mywarranty-5df81-firebase-adminsdk-1rj2z-028a648064.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;
