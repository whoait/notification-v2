const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const datamock = require('./mockdata.json');
const models = require('../models');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

//mock data
var data = datamock;
router.get("/posts", function (req, res) {
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

// handle upload file.
router.post('/upload', upload.single('jsonFile'), function (req, res) {
    const notificationData = JSON.parse(req.file.buffer.toString());
    const bindVersion = req.body.bindVersion;
    console.log(bindVersion);
    // Check ad element
    if (notificationData.hasOwnProperty('ad')) {
        const adElement = notificationData.ad;
        console.log(adElement);
        new Promise((resolve, reject) => {
            // find ad element
            const item = models.bind_notification.findAll({
                where: {
                    message_type: 'ad',
                },
                include: [
                    {
                        model: models.bind_notification_detail,
                        where: {
                            bindVersion: true
                        }
                    }
                ]
            });
            resolve(item)
        }).then((data) => {
            res.send(data);
        });
    }
});

router.get('/test', (req, res) => {
    new Promise((resolve, reject) => {
        const bind_notification = models.bind_notification.create(
            {
                message_type: 'news',
                title: 'News title',
                bind_notification_detail: {
                    content: 'Test content',
                    is_bind10: true
                },
            }
        );
        resolve(bind_notification);
    }).then((data) => {
        const parentId = data.uuid;
        const bindNotificationDetail = models.bind_notification_detail.create(
            {
                parent_id: parentId,
                id: 44,
                is_bind10: true
            }
        );
    }).then((data) => {
        res.send('Ok');
    });
});

router.get('/test2', (req, res) => {
    new Promise((resolve, reject) => {
        const parentId = 'a6c4998e-47d0-43dc-b48a-9671ca5017c9';
        const bindNotificationDetail = models.bind_notification_detail.create(
            {
                parent_id: parentId,
                id: 12,
                is_bind10: true
            }
        );
        resolve(bindNotificationDetail);
    }).then((data) => {
        res.send(data);
    });
});

router.get('/test3', (req, res) => {
    new Promise((resolve, reject) => {
        const parentId = 'a6c4998e-47d0-43dc-b48a-9671ca5017c9';
        const bindNotificationDetail = models.bind_notification_detail.create(
            {
                parent_id: parentId,
                is_bind10: true
            }
        );
        resolve(bindNotificationDetail);
    }).then((data) => {
        res.send(data);
    });
});

module.exports = router;
