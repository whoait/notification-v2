const express = require('express');
const router = express.Router();
const multer = require('multer');
const datamock = require('./mockdata.json');
const models = require('../models');
const util = require('../util/util');
const appConst = require('../util/const');
const _ = require('underscore');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

//mock data
var data = datamock;

router.post("/posts", function (req, res) {
    console.log(req.body.pictures);
    res.set(
        {
            // 'Accept': 'application/json',
            // 'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Credentials': true,
            // 'Access-Control-Allow-Methods': 'POST, GET, PUT, DETETE',
            'x-total-count': 100

        }
    );

    res.send(data);
});


// handle upload notification file.
router.post('/uploadNotificationFile', function (req, res) {
    const bindVersion = req.body.bindVersion;
    const encodedString = req.body.files[0].src.split(',')[1];
    const utf8encoded = (new Buffer(encodedString, 'base64')).toString('utf8');
    const notificationData = JSON.parse(utf8encoded);

    const p1 = checkAdElement(notificationData, bindVersion);
    const p2 = checkNewsListElement(notificationData, bindVersion);
    Promise.all([p1, p2]).then(() => {
        console.log('ALL DONE');
        res.send(util.responseSuccess());
    }).catch(() => {
        console.log('ERROR');
        res.send(util.responseError());
    })
});

router.post('/createNotificationFile', (req, res) => {
    const bindVersion = 'is_bind10';
    createNotificationFile(bindVersion).then((data) => {
        console.log(data);
        res.send(data);
    });
});

function createNotificationFile(bindVersion) {
    return new Promise((resolve, reject) => {
        let output = {};
        buildAdJSONObject(bindVersion).then((data) => {
            output['ad'] = data;
            return output;
        }).then((output) => {
            buildNewsJSONObject(bindVersion).then((data) => {
                output['news'] = data;
                output['schedule'] = [];
                return output;
            }).then((output) => {
                buildPopupJSONObject(bindVersion).then((data) => {
                    output['popup'] = data;
                    resolve(JSON.stringify(output));
                });
            });
        });
    });
}

function buildAdJSONObject(bindVersion) {
    return new Promise((resolve, reject) => {
        new Promise((cResolve, cReject) => {
            const item = models.bind_notification.find({
                where: {
                    message_type: 'ad',
                },
                include: [
                    {
                        model: models.bind_notification_detail,
                        where: {
                            [bindVersion]: true,
                            delete_flag: false,
                            status: appConst.STATUS_PUBLISHING
                        }
                    }
                ]
            });
            cResolve(item);
        }).then((item) => {
            const adObject = {
                title: item.title,
                content: item.content
            };
            resolve(adObject);
        });
    });
}

function buildNewsJSONObject(bindVersion) {
    return new Promise((resolve, reject) => {
        new Promise((cResolve, cReject) => {
            const newsList = models.bind_notification.findAll({
                where: {
                    message_type: 'news',
                },
                include: [
                    {
                        model: models.bind_notification_detail,
                        where: {
                            [bindVersion]: true,
                            status: appConst.STATUS_PUBLISHING,
                            delete_flag: false,
                        }
                    }
                ]
            });
            cResolve(newsList);
        }).then((newsList) => {
            let newsObject = [];
            const promises = _.map(newsList, (element) => {
                return new Promise((cResolve, cReject) => {
                    getElementInNewsList(element.id, bindVersion).then((data) => {
                        const newsElement = {
                            title: element.title,
                            list: data
                        };
                        cResolve(newsElement);
                    });
                });
            });
            Promise.all(promises).then((data) => {
                newsObject.push(data);
                resolve(data);

            })
        })
    })
}

function getElementInNewsList(parentId, bindVersion) {
    return new Promise((resolve, reject) => {
        new Promise((cResolve, cReject) => {
            const newsList = models.bind_notification_detail.findAll({
                where: {
                    parent_id: parentId,
                    [bindVersion]: true,
                    status: appConst.STATUS_PUBLISHING,
                    delete_flag: false,
                    limit: null,
                    $or: [
                        {
                            ext_link: {
                                $ne: null
                            }
                        },
                        {
                            modal_link: {
                                $ne: null
                            }
                        },
                    ]
                }
            });
            cResolve(newsList);
        }).then((newsList) => {
            let newsListObject = [];
            const promises = _.map(newsList, (element) => {
                return new Promise((cResolve, cReject) => {
                    let cElement = {
                        id: parseInt(element.id),
                        date: element.date,
                        title: element.sub_title,
                        content: element.content
                    };
                    if (!util.isEmpty(element.ext_link) && util.isEmpty(element.limit)) {
                        cElement.ext_link = element.ext_link;
                        cResolve(cElement);
                    }
                    else if (!util.isEmpty(element.modal_link) && util.isEmpty(element.limit)) {
                        cElement.modal_link = element.modal_link;
                        cResolve(cElement);
                    }
                    else {
                        cResolve();
                    }
                });
            });
            Promise.all(promises).then((data) => {
                newsListObject.push(data);
                resolve(newsListObject);
            })
        });
    });
}

function buildPopupJSONObject(bindVersion) {
    return new Promise((resolve, reject) =>{
        new Promise((cResolve, cReject) => {
            const popupList = models.bind_notification.findAll({
                where: {
                    message_type: 'popup',
                },
                include: [
                    {
                        model: models.bind_notification_detail,
                        where: {
                            [bindVersion]: true,
                            status: appConst.STATUS_PUBLISHING,
                            delete_flag: false,
                        }
                    }
                ]
            });
            cResolve(popupList);
        }).then((popupList) => {
            let popupObject = [];
            const promises = _.map(popupList, (element) => {
                return new Promise((cResolve, cReject) => {
                    getElementInPopupList(element.id, bindVersion).then((data) => {
                        const newsElement = {
                            list: data
                        };
                        cResolve(newsElement);
                    });
                });
            });
            Promise.all(promises).then((data) => {
                popupObject.push(data);
                resolve(data);

            })
        })
    });
}

function getElementInPopupList(parentId, bindVersion) {
    return new Promise((resolve, reject) => {
        new Promise((cResolve, cReject) => {
            const popupList = models.bind_notification_detail.findAll({
                where: {
                    parent_id: parentId,
                    [bindVersion]: true,
                    status: appConst.STATUS_PUBLISHING,
                    delete_flag: false,
                    limit: {
                        $ne: null
                    },
                    ext_link: {
                        $ne: null
                    }
                }
            });
            cResolve(popupList);
        }).then((popupList) => {
            let popupListObject = [];
            const promises = _.map(popupList, (element) => {
                return new Promise((cResolve, cReject) => {
                    let cElement = {
                        id: parseInt(element.id),
                        date: element.date,
                        title: element.sub_title,
                        content: element.content,
                        ext_link: element.ext_link,
                        limit: element.limit
                    };
                    cResolve(cElement);
                });
            });
            Promise.all(promises).then((data) => {
                popupListObject.push(data);
                resolve(popupListObject);
            })
        });
    });
}

function checkNewsListElement(notificationData, bindVersion) {
    return new Promise((resolve, reject) => {
        if (notificationData.hasOwnProperty('news')) {
            const newsList = notificationData.news;
            if (util.isEmpty(newsList)) {
                resolve();
            }
            else {
                const promises = _.map(newsList, (news) => {
                    return checkEachNewsElement(news, bindVersion);
                });
                Promise.all(promises).then(() => {
                    console.log('all promise done');
                    resolve();
                });
            }
        }
        else {
            reject();
        }
    });
}

function checkEachNewsElement(newsElement, bindVersion) {
    return new Promise((resolve, reject) => {
        const newsTitle = newsElement.title;
        new Promise((cResolve, cReject) => {
            const item = models.bind_notification.find({
                where: {
                    message_type: 'news',
                    title: newsTitle,
                },
                include: [
                    {
                        model: models.bind_notification_detail,
                        where: {
                            delete_flag: false,
                            status: appConst.STATUS_PUBLISHING,
                        }
                    }
                ]
            });
            cResolve(item);
        }).then((item) => {
            if (util.isEmpty(item)) {
                // If news not existed, add new news element
                return addNewsElement(newsTitle, bindVersion);
            }
            else {
                // If news existed, update bind version.
                return updateNewsElementWithBindVersion(item, bindVersion);
            }
        }).then((parentId) => {
            console.log(`process check list item in news element with parent id = ${parentId}`);
            const promises = _.map(newsElement.list, (element) => {
                return new Promise((cResolve, cReject) => {
                    const bind_notification_detail = models.bind_notification_detail.find({
                        where: {
                            parent_id: parentId,
                            id: element.id,
                            delete_flag: false,
                            status: appConst.STATUS_PUBLISHING

                        }
                    });
                    cResolve(bind_notification_detail);
                }).then((bind_notification_detail) => {
                    if (util.isEmpty(bind_notification_detail)) {
                        addElementInNewsList(element, parentId, bindVersion);
                    }
                    else {
                        updateElementInNewsListWithBindVersion(bind_notification_detail, bindVersion);
                    }
                });
            });
            Promise.all(promises).then(() => {
                resolve();
            });
        });
    });
}

function addElementInNewsList(element, parentId, bindVersion) {
    console.log(`add new element in news list with  parent_id = ${parentId}`);
    return new Promise((resolve, reject) => {
        models.bind_notification_detail.create(
            {
                parent_id: parentId,
                id: element.id,
                date: element.date,
                sub_title: element.title,
                content: element.content,
                modal_link: element.modal_link,
                ext_link: element.ext_link,
                limit: element.limit,
                [bindVersion]: true,
                status: appConst.STATUS_PUBLISHING
            }
        );
        resolve();
    });
}

function updateElementInNewsListWithBindVersion(element, bindVersion) {
    console.log(`update element in news list with bind version ${bindVersion} and parent_id = ${element.parent_id}`);
    return new Promise((resolve, reject) => {
        models.bind_notification_detail.update(
            {
                [bindVersion]: true
            },
            {
                where: {
                    id: element.id,
                    parent_id: element.parent_id,
                    delete_flag: false,
                    status: appConst.STATUS_PUBLISHING
                },
            }
        );
        resolve();
    });
}

function addNewsElement(newsTitle, bindVersion) {
    console.log(`add new element`);
    return new Promise((resolve, reject) => {
        new Promise((cResolve, cReject) => {
            const bind_notification = models.bind_notification.create(
                {
                    message_type: 'news',
                    title: newsTitle
                }
            );
            cResolve(bind_notification);
        }).then((bind_notification) => {
            const parentId = bind_notification.id;
            models.bind_notification_detail.create(
                {
                    parent_id: parentId,
                    [bindVersion]: true,
                    status: appConst.STATUS_PUBLISHING
                }
            );
            return parentId;
        }).then((parentId) => {
            resolve(parentId);
        });
    });
}

function updateNewsElementWithBindVersion(item, bindVersion) {
    console.log(`update new element with bind version ${bindVersion} and parent_id = ${item.id}`);
    return new Promise((resolve, reject) => {
        models.bind_notification_detail.update(
            {
                [bindVersion]: true
            },
            {
                where: {
                    parent_id: item.id,
                    delete_flag: false,
                    status: appConst.STATUS_PUBLISHING
                },
            }
        );
        resolve(item.id);
    });
}

function checkAdElement(notificationData, bindVersion) {
    return new Promise((resolve, reject) => {
        if (notificationData.hasOwnProperty('ad')) {
            const adElement = notificationData.ad;
            const adTitle = adElement.title;
            const adContent = adElement.content;
            new Promise((cResolve, cReject) => {
                const item = models.bind_notification.find({
                    where: {
                        message_type: 'ad',
                        title: adTitle,
                        content: adContent
                    },
                    include: [
                        {
                            model: models.bind_notification_detail,
                            where: {
                                delete_flag: false,
                                status: appConst.STATUS_PUBLISHING
                            }
                        }
                    ]
                });
                cResolve(item);
            }).then((item) => {
                if (util.isEmpty(item)) {
                    // If ad not existed, add new Ad
                    addNewAd(adTitle, adContent, bindVersion);
                }
                else {
                    // If ad existed, update bind version.
                    updateAdWithBindVersion(item, bindVersion);
                }
                resolve();
            });
        }
        else {
            reject();
        }
    });
}

function updateAdWithBindVersion(item, bindVersion) {
    console.log(`update ad element with bind version ${bindVersion} and parent_id = ${item.id}`);
    return new Promise((resolve, reject) => {
        models.bind_notification_detail.update(
            {
                [bindVersion]: true
            },
            {
                where: {
                    parent_id: item.id,
                    delete_flag: false,
                    status: appConst.STATUS_PUBLISHING
                },
            }
        );
        resolve();
    });
}

function addNewAd(adTitle, adContent, bindVersion) {
    console.log(`add new ad element `);
    return new Promise((resolve, reject) => {
        new Promise((cResolve, cReject) => {
            const bind_notification = models.bind_notification.create(
                {
                    message_type: 'ad',
                    title: adTitle,
                    content: adContent,
                }
            );
            cResolve(bind_notification);
        }).then((bind_notification) => {
            const parentId = bind_notification.id;
            const bindNotificationDetail = models.bind_notification_detail.create(
                {
                    parent_id: parentId,
                    [bindVersion]: true,
                    status: appConst.STATUS_PUBLISHING
                }
            );
        }).then(() => {
            resolve();
        });
    });
}

module.exports = router;
