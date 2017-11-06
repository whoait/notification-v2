const express = require('express');
const router = express.Router();
const multer = require('multer');
const datamock = require('./mockdata.json');
const models = require('../models');
const util = require('../util/util');
const appConst = require('../util/const');
const base64 = require('base-64');
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
    const notificationData = JSON.parse(base64.decode(req.body.files[0].src.split(',')[1]));

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
            const prommises = _.map(newsElement.list, (element) => {
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
            Promise.all(prommises).then(() => {
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
