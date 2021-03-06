const express = require('express');
const router = express.Router();
const datamock = require('./mockdata.json');
const models = require('../models');
const util = require('../util/util');
const path = require('path');
const notificationService = require('../services/notification_service');
const appConst = require('../util/const');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

//mock data
const data = datamock;


//get one
router.get("/posts/:id", function (req, res) {
    const notificationId = req.params.id;
    notificationService.findNotificationById(notificationId).then((data) => {
        res.send(data);
    });
});


//edit notification
router.put("/posts/:id", function (req, res) {
    const notificationId = req.params.id;
    const item = req.body;
    const status = item.status;
    console.log(item);
    notificationService.updateNotification(notificationId, item).then(() => {
        if (status === appConst.STATUS_PUBLISHING) {
            const imageURL = item.image_url;
            notificationService.uploadImage(notificationId, imageURL).then(() => {
                notificationService.buildJsonFile(notificationId).then(() => {
                    res.send(util.responseSuccess());
                }).catch((err) => {
                    res.send(util.responseError());
                });
            }).catch((err) => {
                res.send(util.responseError());
            });
        }
        else {
            res.send(util.responseSuccess());
        }
    });
});

// create new posts
router.post("/posts", function (req, res) {
    const item = req.body;
    notificationService.createNotification(item).then(() => {
        res.send(util.responseSuccess());
    }).catch((err) => {
        res.send(util.responseError());
    });
});

// handle upload notification file.
router.post('/uploadNotificationFile', function (req, res) {
    const bindVersion = req.body.bindVersion;
    const encodedString = req.body.files[0].src.split(',')[1];
    const utf8encoded = (new Buffer(encodedString, 'base64')).toString('utf8');
    const notificationData = JSON.parse(utf8encoded);

    const p1 = notificationService.checkAdElement(notificationData, bindVersion);
    const p2 = notificationService.checkNewsListElement(notificationData, bindVersion);
    const p3 = notificationService.checkPopupListElement(notificationData, bindVersion);
    Promise.all([p1, p2, p3]).then(() => {
        console.log('ALL DONE');
        res.send(util.responseSuccess());
    }).catch(() => {
        console.log('ERROR');
        res.send(util.responseError());
    })
});

router.post('/createNotificationFile', (req, res) => {
    const bindVersion = req.body.bindVersion;
    notificationService.createNotificationFile(bindVersion).then((data) => {
        res.send(data);
    });
});

//get list uploadNotificationFile
router.get('/uploadNotificationFile', (req, res) => {
    res.set({
        'x-total-count': 0
    });
    res.send(data);
});

router.put('/changeStatus/:id', (req, res) => {
    const notificationId = req.params.id;
    const newStatus = req.body.status;
    const imageURL = req.body.image_url;
    notificationService.updateStatus(notificationId, newStatus).then((data) => {
        if (newStatus === appConst.STATUS_PUBLISHED) {
            notificationService.buildJsonFile(notificationId).then(() => {
                res.send(util.responseSuccess());
            }).catch((err) => {
                res.send(util.responseError());
            });
        }
        if (newStatus === appConst.STATUS_PUBLISHING) {
            if (!util.isEmpty(imageURL)) {
                notificationService.uploadImage(notificationId, imageURL).then(() => {
                    notificationService.buildJsonFile(notificationId).then(() => {
                        res.send(util.responseSuccess());
                    }).catch((err) => {
                        res.status(500).res.send(util.responseError());
                    });
                }).catch((err) => {
                    res.status(500).send(util.responseError());
                });
            }
            else {
                notificationService.buildJsonFile(notificationId).then(() => {
                    res.send(util.responseSuccess());
                }).catch((err) => {
                    res.status(500).res.send(util.responseError());
                });
            }
        }
    });
});

router.delete('/posts/:id', (req, res) => {
    const notificationId = req.params.id;
    notificationService.deleteNotification(notificationId).then(() => {
        res.send(util.responseSuccess());
    });
});

//get list
router.get('/posts', (req, res) => {
    notificationService.getAllNotifications().then((data) => {
        res.set({
            'x-total-count': data.length
        });
        res.send(data);

    });
});

router.get('/test', (req, res) => {
    const imagePath = path.join(__dirname, '/notification171015_03.png');
    console.log(imagePath);
    notificationService.uploadImage(imagePath, 'test.png').then(() => {
        res.send('ok');
    });
});

//get list category
router.get('/categories', (req, res) => {
    notificationService.getAllCategories().then((data) => {
        res.set({
            'x-total-count': data.length
        });
        res.status(200).send(data);
    });
});

//get one category
router.get('/categories/:id', (req,res) => {
    notificationService.getCategoryById(req.params.id).then((data) => {
        res.send(data);
    });
});

module.exports = router;
