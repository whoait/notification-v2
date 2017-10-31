const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const datamock = require('./mockdata.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//mock data
var data = datamock;
router.get("/posts", function (req, res) {
    res.send(data);
});

// handle upload file.
router.post('/upload', upload.single('jsonFile'), function(req, res) {
    console.log(req.file);
    console.log(req.body);
    const data = {
        message: 'ok'
    };
    res.send(data);
});

module.exports = router;
