#Johayo pvs (parameter validation set)
 express를 쓰면서 넘어오는 parameter들을 변수에 넣어주는 역활을 해준다. 어떻게 보면 java의 VO와 같은 역활이라고 생각하면 편할듯 하다. 간단하게 validation과 변수의 type정도를 체크해 준다.
 
##변경사항
1. 에러코드 409 => 400 으로 변경처리
2. 기존에 사용하시는 분들은 409에서 400으로 변경하셔서 사용해야됩니다.
##설치
```javascript
$ npm install johayo-pvs
```

##설정
```
1. type: 변수의 type
	- 현재 Number, String, Boolean 만 가능하며, 해당 type으로 변환해준다. 남어지 타입들은 그냥 값을 넣어준다.(Object, Array ...)
2. validate: 이것이 선언되어 있으면 바로 체크를 진행한다. 아직 단순 값 체크다.
	{
    	method: 유효성 검사시 해당 메소드만 검사(,로 구분) 없는경우 전체 검색
        checkURL :
            - 배열로 넣어야됨
            - 체크하지 않을 url은 앞에 ! 붙인다.
            - restful api일 경우 체크가 되지 않는다.[ex) /userId/:userId]
    }
3. default: 디폴트 값 (request method가 Get이 아닐때만 된다)
```

##오류
status|code|message|비고
-|-|-|-
400|bad_param|해당 변수명|검색하는 변수명에 대한 값이 없는경우.
400|bad_type|'type'|타입이 잘못된 경우.(예. "123ab" 값을 Number로 변환할때)


## 예제
#####1. router 파일 안에서 통합으로 쓸 경우
```javascript
'use strict';
let johayoPvs = require("johayo-pvs");
let router = express.Router();

let loginVo = new johayoPvs({
	userId: {type: String, validate: {method: "POST, DELETE, PUT"}},
    password: {type: String, validate: {method: "POST", checkURL: ["/login", "/join"]}},
    isDelete: {type: Boolean, Bdefault: false}
    gender: String
});

router.post("/login", function(req, res, next) {
        loginVo.set(req, res, next);
    }, function(req, res) {
	    console.log(loginVo.get);
    })

module.exports = router;
```

#####2. router 파일과 vo 파일을 분리해서 사용할 경우
```javascript
loginVO.js
'use strict';
let johayoPvs = require("johayo-pvs");
module.exports = new johayoPvs({
	userId: {type: String, validate: {method: "POST, DELETE, PUT"}},
    password: {type: String, validate: {method: "POST", checkURL: ["/login", "/join"]}},
    isDelete: {type: Boolean, Bdefault: false}
    gender: String
});
```

```javascript
loginRouter.js
'use strict';
let loginVO = require("loginVO"); //or var loginVO = require("loginVO.js")
let router = express.Router();

let pvs = (req, res, next) => {
    loginVO.set(req, res, next)
};

router.post("/login", pvs, function(req, res) {
	console.log(loginVO.get);
});

module.exports = router;
```

