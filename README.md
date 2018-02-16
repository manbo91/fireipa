# Fireipa

### Node.js + Express + firebase + ES6 / API server

파이어베이스와 Express.js를 이용한 간단한 API 서버 만들기!

안녕하세요. 저는 2년전부터 프로그램을 독학하고 있는 비전공 프로그래머(?)입니다. 현재는 **React**와 API 서버를 이용한 서비스를 기획하고 있습니다.

그래서 이번에 API 서버를 처음 만들어봤습니다. 반복적인 작업이 계속 생겨나더라구요. (GET, POST, PUT, DELETE에서...) 그래서 **Firebase** 데이터를 사용하는 방법을 생각해봤습니다. Nosql로 이루어진 실시간 데이터베이스나 Firestore를 이용하려면 관계형데이터베이스와는 다른 방식으로 데이터를 설계하고 API 또한 만들어야했습니다. 그래서 Firestore의 collection과 document 방식의 데이터베이스를 쉽게 활용할 방법을 찾았죠. 이미 Nosql 쿼리, 페이지화 등등을 지원해주기 때문에 데이터 모델 관리만 할 수 있다면 반복 작업이 많이 줄어들 것이라고 생각했습니다.

Fireipa는 기본적인 api 기능들을 아주 빠르게 구현할 수 있습니다. (제 생각으로는.. 그렇습니다)


# 시작하기

기본적으로는 express 보일러 플레이트라고 생각하시면 될 것 같습니다.

    # Clone the project
    git clone https://github.com/manbo91/fireipa.git {projectName}
    
    # Make it your own
    rm -rf .git && git init && npm init

	# Install dependencies
	npm install or yarn

개발 환경을 시작하려면

    # yarn
	yarn run dev

	# npm
	npm run dev

우선 fireipa를 사용하려면 firebase 콘솔에서 프로젝트를 생성합니다.

 1. 프로젝트 콘솔 설정에서 사용자 및 권한으로 들어갑니다.
 2. 서비스 계정으로 들어가서 서비스 계정을 만들어주세요.
 3. 새로운 비공개 키 제공을 선택하여 비공개 키를 다운받습니다.
 4. 다운로드 받은 비공개 키(JSON)는 src/fireipa/setup.js에서 serviceAccount 경로로 설정해줍니다.

```javascript
import admin from "firebase-admin";
import serviceAccount from "./key/projectId-5df81-firebase-adminsdk-1rj2z-028a648064.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const adminId = "";

export default admin;
```

마지막으로 firebase 콘솔의 Authentication를 이용해 관리자 계정으로 이용할 아이디를 하나 만들어줍니다. 위의 `export const adminId = "{관리자 계정 uid}";`를 입력해주세요.

이제 모든 준비는 끝났습니다!

## 문서 모델 만들기 

Nosql 문서의 모델을 만듭니다. 저장하거나 수정하거나 가져올 데이터의 모양을 만듭니다.

```javascript
import fireipa from "../fireipa";

const rootRef = fireipa.db.collection("users");

const userModel = new fireipa.models.FireStoreModel(rootRef, {
  displayName: "stringValue",
  email: "stringValue",
});

export default { userModel };
```

기본적인 user 모델입니다. rootRef는 model이 저장될 참조입니다.
데이터 모델을 만드는 방법은 아주 쉽습니다. key-type 쌍으로 이루어진 객체만 있으면 됩니다. 

      --- Type ---
	  nullValue: null
	  booleanValue: boolean
	  integerValue: string, doubleValue: number
	  timestampValue: string
	  stringValue: string
	  bytesValue: string
	  referenceValue: string
	  geoPointValue { object(LatLng) }
	  arrayValue: {
	    object(ArrayValue)
	  }
	  mapValue: {
	    object(MapValue)
	  }

firestore에서 저장할 수 있는 type들입니다. 아직은 기본적인 타입검사만 합니다.
```javascript
import fireipa from "../fireipa";

const rootRef = fireipa.db.collection("coupons");

const couponModel = new fireipa.models.FireStoreTimestampModel(rootRef, {
  name: "stringValue",
  percent: "stringValue",
  photoUri: "stringValue",
  rating: "stringValue",
  restricted: "stringValue",
  type: "stringValue"
});

const couponLogModel = docId =>
  new fireipa.models.FireStoreTimestampDeepModel(rootRef, docId, "log", {
    name: "stringValue",
    update: "stringValue"
  });

export default { couponModel, couponLogModel };
```

필요한 필드가 생기면 모델에 객체를 추가하면 되고 필요없는 필드가 생기면 삭제하면 끝입니다.  Model의 종류에는 

 - **FireStoreModel**: 기본적인 데이터 모델
 - **FireStoreTimestampModel**: 생성시간과 수정시간을 기록하는 모델
 - **FireStoreDeepModel**: 데이터의 계층적인 접근이 가능한 모델
 - **FireStoreTimestampDeepModel**: 딥모델의 시간 기록 추가

이 있습니다.

간단합니다! 
> 문서모델을 만든 뒤에는 models/index.js 에 import, export 코드를 꼭 업데이트해주세요.

## baseRouter 활용하기

기본적으로 express에서 router를 사용하는 것과 동일합니다. 하지만 귀찮은 일이 있죠. 데이터를 불러오고 수정하고 삭제하고...  기본적인 기능들 그래서 제가 만들었습니다. 기본라우터를 말이죠!

```javascript
import models from "../models";
import Router from "./router";

const router = Router.baseRouter(models.coupons.couponModel);

// custom
router.get("/test/test", (req, res) => {
  res.status(200).send("test good");
});

export default router;
```

이게 다입니다.  이제 쿠폰 문서 모델에 대한 GET, POST, PUT, DELETE가 작동합니다.

**baseRouter(model, apiPrivate: boolean):** 두 번째 argument로 true를 보내면 비공개 api를 만들 수 있습니다. 비공개 api는 기본적으로 모든문서 가져오기, 랜덤아이디로 문서 생성, 문서 검색이 되지 않습니다.  문서 id와 유저 id가 동일할 시에만 해당 문서 가져오기, 수정, 삭제가 가능한 api가 만들어집니다.
> setup.js에 설정한 관리자 계정은 모든 비공개 api를 사용 가능합니다.

 - http://localhost:8080/coupons/
	> **GET:** coupons 컬렉션의 모든 문서를 가져옵니다.
	> **POST:** 랜덤 ID를 생성하여 문서를 저장합니다.

 - http://localhost:8080/coupons?name=test&persent=10
	> **GET:** name이 test이고 persent가 10인 쿠폰 문서를 가져옵니다.

 - http://localhost:8080/coupons?field=name&offset=20&limit=50
	> **GET:** 필드기준 name으로 21번째 문서부터 50개의 문서를 가져옵니다.
	> offset을 지정하지 않으면 1번째 문서부터 가져옵니다.
 
 - http://localhost:8080/coupons/search?name=goo
	 > **GET**: name안에 goo가 들어간 쿠폰 문서를 가져옵니다.

 - http://localhost:8080/coupons/:docId
	> **GET**: id 값이 docId인 문서를 가져옵니다.
	> **POST**: docId를 지정하여 문서를 생성합니다. 기존에 있는 아이디라면 데이터를 덮어씌웁니다.
	> **PUT**: id 값이 docId인 문서를 업데이트 합니다.
	> **DELETE**: id 값이 docId인 문서를 삭제합니다.

## 모델 메서드

| method | description | return |
|--|--|--|
| create(docId, data) | docId를 지정하여 문서를 생성합니다. | docId |
| add(data) | 랜덤한 Id를 통해 문서를 생성합니다. | docId |
| update(docId, data) |  문서를 업데이트 합니다. | docId |
| delete(docId) | 문서를 제거합니다. | docId |
| get(docId) | 문서를 데이터를 가져옵니다. | Object |
| getAll() | 컬렉션의 모든 문서를 가져옵니다. | Array |
| getFilter(query) | 쿼리 내용과 일치하는 문서를 가져옵니다. (다중옵션 가능) | Array |
| getSearch(query) | 쿼리 필드 내용으로 컬렉션의 문서를 검색합니다. | Array |
| getPage({ field, offset, limit }) | 컬렉션의 문서를 페이지화하여 가져옵니다. (field:  페이지화 기준, offset: ~ 번째 레코드 부터, limit: 가져올 개수 | Array |


#### example
```javascript
import models from "../models";
import Router from "./router";

const router = Router.baseRouter(models.coupons.couponModel);

router.get("/custom/:docId", async (req, res) => {
  const data = await models.coupons.couponModel.get(req.params.docId);
  if (!data) {
    res.sendStatus(404);
  } else {
    res.status(200).send(data);
  }
});

export default router;
```

기본적인 모델 메서드 사용법입니다. 모든 메서드는 error가 발생하면 false를 반환합니다.

이걸로 API 서버가 만들어졌네요!


## 앞으로

권한에 대한 api 고민이 있습니다. 어떻게 해결할지 고민이네요.


## API 요청 예시

Redux에 firebase 로그인을 통해서 회원 토큰을 저장합니다.
데이터를 요청할 때 Headers의 Authorization에 토큰을 같이 보냅니다.

```javascript
// API actions
function emailLogin(email, password) {
  return dispatch => {
    dispatch(loading());
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            firebase
              .auth()
              .currentUser.getIdToken(true)
              .then(idToken => {
                dispatch(getUser(idToken));
                dispatch(saveToken(idToken));
              })
              .catch(error => {
                console.log(error);
              });
          })
          .catch(error => dispatch(authError(error)));
      })
      .catch(error => console.log(error));
  };
}

function getData(params) {
  return (dispatch, getState) => {
    axios
      .get(api.baseURL("/data/"), {
        headers: {
          Authorization: getState().user.token
        },
        params
      })
      .then(response => {
        dispatch(setCompanies(response.data));
      })
      .catch(error => {
        api.handleError(error, () => {
          dispatch(userActions.firebaseLogout());
        });
      });
  };
}
```