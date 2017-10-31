const express = require('express');
const router = express.Router();
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

module.exports = router;
