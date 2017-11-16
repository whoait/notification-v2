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


//edit
router.put("/posts/:id", function (req, res) {

    console.log(req.get(':id'));
    res.set(
        {
            // 'Accept': 'application/json',
            // 'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Credentials': true,
            // 'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE',
            'x-total-count': 100

        }
    );

    res.send(data[0]);
});

router.post("/posts", function (req, res) {
    console.log(req.body.pictures);
    res.set(
        {
            // 'Accept': 'application/json',
            // 'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Credentials': true,
            // 'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE',
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

router.put('/changeStatus/:id', (req, res) => {
    const notificationId = req.params.id;
    const newStatus = req.body.status;
    notificationService.updateStatus(notificationId, newStatus).then((data) => {
        console.log(data);
        if (newStatus === appConst.STATUS_PUBLISHED) {
            notificationService.buildJsonFile(notificationId).then(() => {
                res.send(util.responseSuccess());
            }).catch((err) => {
                res.send(util.responseError());
            });
        }
        if (newStatus === appConst.STATUS_PUBLISHING) {
            res.send(util.responseSuccess());
        }
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
    notificationService.uploadImages(imagePath, 'test.png').then(() => {
        res.send('ok');
    });
});

module.exports = router;
