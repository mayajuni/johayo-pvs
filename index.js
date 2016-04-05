'use strict';
var johayoError = require("./error/johayoError");

/**
 * 선언을 할시 params을 받아온다.
 * params는 Object이어야 되며, 여기에 맞게 변경 처리 할 수 있다.
 * 변수값까지 전부 변환해서 리턴해준다.
 * 변수 type이 object 일 경우 바로 체크를 진행한다.
 *
 *
 *  변수 설정
 *  type: type 설정
 *  validate : {
 *      method: 유효성 검사시 해당 메소드만 검사(,로 구분) 없는경우 전체 검색
 *      checkURL :
 *          - 배열로 넣어야됨
 *          - 체크하지 않을 url은 앞에 ! 붙인다.
 *          - restful api일 경우 체크가 되지 않는다.[ex) /userId/:userId]
 *  }
 *  default: 디폴트 값 (Get이 아닐때만 된다);
 *
 * @param params
 * @constructor
 */

class Jpvs {
    constructor(params) {
        this.params = params;
        this.get = {};
    }

    set(req, res, next) {
        this.get = {};
        const method = req.method.toUpperCase();
        const params = method == "POST" || method == 'PUT' ? req.body : req.query;
        const beforeParams = this.params;
        const originalUrl = req.originalUrl;

        for(let key in beforeParams) {
            let notCheck = false;
            const param = beforeParams[key];

            if(param.validate){
                if(!param.validate.method || param.validate.method.toUpperCase().indexOf(method) > -1) {
                    if(param.validate.checkURL){
                        for(let url of param.validate.checkURL) {
                            const checkURL = url.replace('!', '');
                            const isNotCheckURL = url.substr(0,1) == '!';

                            if(isNotCheckURL) {
                                if(originalUrl === checkURL || originalUrl === checkURL + '/') {
                                    notCheck = true;
                                    break;
                                }
                            }else if(!isNotCheckURL){
                                notCheck = true;
                                if(originalUrl === checkURL || originalUrl === checkURL + '/') {
                                    notCheck = false;
                                    break;
                                }
                            }
                        }

                        if(!notCheck && (!params[key] && !req.params[key])){
                            return next(new johayoError('bad_param', key));
                        }
                    }
                }
            }

            if(params[key] || req.params[key]){
                let val = !params[key] ? req.params[key] : params[key];
                let type = typeof beforeParams[key] === 'object' ? beforeParams[key].type : beforeParams[key];
                if(type) {
                    if(type === Boolean) {
                        val = val === 'true' ? true : false;
                    }else{
                        val = type(val);
                        if(!val) {
                            return next(new johayoError('bad_type', 'type'));
                        }
                    }
                }

                this.get[key] = val;
            }else if(param.default && method !== 'GET'){
                this.get[key] = param.default;
            }else{
                delete this.get[key];
            }
        }

        next();
    };
}

module.exports = Jpvs;