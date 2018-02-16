import fireipa from "../../fireipa";

export const ADMIN_ID = fireipa.adminId;

export function doPrivate(res, apiPrivate, callBack) {
  if (apiPrivate) {
    res.sendStatus(401);
  } else {
    callBack();
  }
}

export function doPrivateDoc(res, docId, userId, apiPrivate, callBack) {
  if (apiPrivate && (docId === userId || userId === ADMIN_ID)) {
    callBack();
  } else if (!apiPrivate) {
    callBack();
  } else {
    res.sendStatus(401);
  }
}

export function checkToken(req) {
  const idToken = req.get("Authorization");
  return new Promise(resolve => {
    if (idToken) {
      fireipa.auth
        .verifyIdToken(idToken)
        .then(decodedToken => {
          const { uid } = decodedToken;
          resolve(uid);
        })
        .catch(error => {
          console.error(error);
          resolve(false);
        });
    } else {
      resolve(false);
    }
  });
}
