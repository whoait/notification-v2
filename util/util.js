'use strict';
const _ = require('underscore');
const fs = require('fs')


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

exports.responseError = () => {
    const res = {
        message: "error",
        // content: "Invalid json format"
    };
    return JSON.stringify(res);
};

exports.writeJson = (aPath, aData)=>{
    return new Promise((resolve, reject) => {
        fs.writeFile(aPath, aData, (err)=>{
            resolve(err);
        });
    });
};

exports.makeDirIfNotExisted = (aPath) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(aPath)){
            fs.mkdir(aPath, (err) =>{
                resolve(err);
            });
        }
        else {
            resolve();
        }
    })
};

exports.writeImage = (aPath, aData) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(aPath, aData, (err) => {
            resolve(err);
        })
    });
};

exports.formatDateWithPattern_YYYYMMDD = (date) => {
    return new Date(date).toLocaleDateString().replace(/(-)/g, "\/");
};