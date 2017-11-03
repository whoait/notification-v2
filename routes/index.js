const express = require('express');
const router = express.Router();
const multer = require('multer');
const datamock = require('./mockdata.json');
const models = require('../models');
const util = require('../util/util');
const appConst = require('../util/const');
const base64 = require('base-64');

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
    const notificationData = JSON.parse(base64.decode(req.body.data));
    console.log('start');

    checkAdElement(notificationData, bindVersion)
        .then(() => {
            console.log('all done');
            res.send(util.responseSuccess());
        })
        .catch(() => {
            res.send(util.responseInvalidJsonFormat());
        });
});


function checkAdElement(notificationData, bindVersion) {
    return new Promise((resolve, reject) => {
        if (notificationData.hasOwnProperty('ad')) {
            const adElement = notificationData.ad;
            const adTitle = adElement.title;
            const adContent = adElement.content;
            new Promise((cResolve, cReject) => {
                const item = models.bind_notification.findAll({
                    where: {
                        message_type: 'ad',
                        title: adTitle,
                        content: adContent
                    },
                    include: [
                        {
                            model: models.bind_notification_detail,
                            where: {
                                delete_flag: false
                            }
                        }
                    ]
                });
                console.log('check done');
                cResolve(item);
            }).then((item) => {
                if (util.isEmpty(item)) {
                    console.log('start add');
                    addNewAd(adTitle, adContent, bindVersion);
                }
                else {
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

function updateAdWithVersion(item, bindVersion) {
    return new Promise((resolve, reject) => {
        models.bind_notification_detail.update(
            {
                [bindVersion]: true
            },
            {
                where: {parent_id: item.parent_id}
            }
        );
        resolve();
    });
}

function addNewAd(adTitle, adContent, bindVersion) {
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
