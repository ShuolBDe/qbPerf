var express = require('express');
var router = express.Router();
var mkHtmls = require('../public/javascripts/utils/mkHtmls');
var getHyperText = require('../public/javascripts/utils/getHyperText');
var getUrl = require('../public/javascripts/query/getUrl');
var updateContent = require('../public/javascripts/utils/updateContent');
var insertFromCsv = require('../public/javascripts/utils/insertFromCsv');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

// router.get('/test', (req, res, next) => {
//   // res.send('test');
// });

router.post('/writefiles', (req, res, next) => {
  if(req.body && req.body.pn && req.body.rn) {
    res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
    if(req.body.isAll == 1) {
      mkHtmls(0, 0, req.body.isAll).then( (data) => {
        res.json(data);
      });
    } else {
      mkHtmls(req.body.pn, req.body.rn, false).then( (data) => {
        res.json(data);
      });
    }
  }
});

router.post('/geturl', (req, res, next) => {
  if(req.body && req.body.pn && req.body.rn) {
    res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
    getUrl(req.body.pn, req.body.rn, (ret) => {
      res.json(ret);
    });
  } else {
    res.status(400).send('Bad params');
  }
});

router.post('/gethypertext', (req, res, next) => {
  if(req.body && req.body.pn && req.body.rn) {
    res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
    getHyperText(req.body.pn, req.body.rn, (ret) => {
      res.json(ret);
    });
  } else {
    res.status(400).send('Bad params');
  }
});

router.post('/updatecontent', (req, res, next) => {
  if(req.body && req.body.data) {
    res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
    updateContent(req.body.data, (ret) => {
      res.json(ret);
    });
  } else {
    res.status(400).send('Bad params');
  }
});

router.post('/insertfromcsv', (req, res, next) => {
  if(req.body.name = 'wangyan01' && req.body.passwd == '123456') {
    insertFromCsv();
  }
});

module.exports = router;