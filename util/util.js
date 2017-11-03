'use strict';
const _ = require('underscore');


exports.isEmpty = (aData) =>{
    let ret = false;
    if(aData === null){
        ret = true;
    }else if(aData === void 0){
        ret = true;
    }else if(aData === ''){
        ret = true;
    }else if(aData.length === 0){
        ret = true;
    }else if(_.isEmpty(aData)){
        ret = true;
    }
    return ret;
};

exports.responseSuccess = () => {
  const res = {
      message: "success"
  };
  return JSON.stringify(res);
};

exports.responseInvalidJsonFormat = () => {
    const res = {
        message: "error",
        content: "Invalid json format"
    };
    return JSON.stringify(res);
};