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
    // Check ad element
    if (notificationData.hasOwnProperty('ad')) {
        const adElement = notificationData.ad;
        console.log(adElement);

        new Promise((resolve, reject) => {
            const item = models.bind_notification_detail.findAll({});
            resolve(item)
        }).then((data) => {
            res.send(data);
        });
    }
});

router.get('/test', (req, res) => {
    new Promise((resolve, reject) => {
        const item = models.bind_notification_detail.create({
            content: 'Test AD'
        });
        resolve(item)
    }).then((data) => {
        res.send(data);
    });
});

module.exports = router;
