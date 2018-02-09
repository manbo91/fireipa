/*
  --- Type 종류 ---
  Null 값: nullValue: null
  부울 값: booleanValue: boolean
  숫자순으로 정렬된 정수 및 부동 소수점 값: integerValue: string, doubleValue: number
  날짜 값: timestampValue: string
  텍스트 문자열 값: stringValue: string
  바이트 값: bytesValue: string
  Cloud Firestore 참조: referenceValue: string
  지리적 지점 값: geoPointValue { object(LatLng) }
  배열 값: arrayValue: {
    object(ArrayValue)
  }
  지도 값: mapValue: {
    object(MapValue)
  }
*/

function checkType(type) {
  switch (type) {
    case "nullValue":
      return "null";
    case "booleanValue":
      return "boolean";
    case "numberValue":
      return "number";
    case "timestampValue":
      return "object";
    case "stringValue":
      return "string";
    case "bytesValue":
      return "string";
    case "referenceValue":
      return "object";
    case "geoPointValue":
      return "object";
    case "arrayValue":
      return "object";
    case "mapValue":
      return "object";
    default:
      return "undefined";
  }
}

export class FireStoreModel {
  constructor(collectionRef, documentType) {
    this.collectionRef = collectionRef;
    this.documentType = documentType;
  }

  get(uid) {
    return new Promise((resolve, reject) => {
      this.collectionRef.doc(uid).get().then(doc => {
        const data = doc.data();
        const checkDocTypeData = {};

        Object.keys(this.documentType).forEach(typeName => {
          const isType = typeof data[typeName] === checkType(this.documentType[typeName]);
          if (isType) {
            checkDocTypeData[typeName] = data[typeName];
          } else if (!isType) {
            checkDocTypeData[typeName] = data[typeName];
            console.warn(`The "${typeName}" type is not matched.`);
          } else if (typeof data[typeName] === "undefined") {
            checkDocTypeData[typeName] = null;
          }
        });
        resolve(checkDocTypeData);
      }).catch(err => {
        reject(err);
      });
    })
      .then(data => data)
      .catch(err => err);
  }
}

export default { FireStoreModel };
