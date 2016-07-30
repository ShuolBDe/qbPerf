'use strict';
var dbconn = require('../dbconnection/connectPool');

var queryItem = 'SELECT tid, hypertext FROM latex limit ?,?',
  queryCount = 'SELECT count(*) AS total FROM latex';

function getItem(ret, pn, rn) {
  return new Promise((resolve, reject) => {
    dbconn.query(queryItem, [(pn - 1) * rn, rn], (err, rows, fields) => {
      if (err) {
        console.log('getHtmlList get hypertext err: ' + err);
        reject();
      } else {
        ret.data = new Array();
        for (let i in rows) {
          ret.data.push({
            tid: rows[i].tid,
            hyperText: rows[i].hypertext
          });
        }
        resolve();
      }
    });
  });
}

function hasMore(ret, pn, rn) {
  return new Promise((resolve, reject) => {
    dbconn.query(queryCount, (err, rows, fields) => {
      if (err) {
        console.log('getHtmlList get count err: ' + err);
        reject();
      } else {
        ret.hasMore = (rows[0].total > (pn - 1) * rn);
        resolve();
      }
    });
  });
}

module.exports = (pn, rn, callback) => {
  var ret = new Object();
  ret.def = 'never',
    pn = parseInt(pn),
    rn = parseInt(rn);

  if (!isNaN(pn) && !isNaN(rn)) {
    var mGetItem = getItem.bind(null, ret, pn, rn),
      mHasMore = hasMore.bind(null, ret, pn, rn);
    ret.def = 'ever';
    callback && mGetItem().then(() => {
      mHasMore().then(() => {
        // console.log('last: ' + JSON.stringify(ret, null, '  '));
        callback(ret);
      });
    });
    // dbconn.end();
  } else {
    callback && callback('pn or rn is not a number!');
  }
}