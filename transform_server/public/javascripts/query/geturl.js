'use strict';

var dbconn = require('../dbconnection/connectPool');

var queryItem = 'SELECT tid,url FROM latex limit ?,?',
  queryCount = 'SELECT COUNT(*) FROM latex';

function getItem(ret, pn, rn) {
  return new Promise((resolve, reject) => {
    dbconn.query(queryItem, [(pn - 1) * rn, rn], (err, rows, fields) => {
      if (err) {
        console.log('getUrl get url err: ' + err);
        reject();
      } else {
        ret.data = new Array();
        for (let i in rows) {
          ret.data.push({
            tid: rows[i].tid,
            url: rows[i].url
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
        console.log('getUrl get count err: ' + err);
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
    pn = parseInt(pn),
    rn = parseInt(rn);

  if (!isNaN(pn) && !isNaN(rn)) {
    var mGetItem = getItem.bind(null, ret, pn, rn),
      mHasMore = hasMore.bind(null, ret, pn, rn);
    callback && mGetItem().then(() => {
      mHasMore().then(() => {
        // console.log('last: ' + JSON.stringify(ret, null, '  '));
        callback({
          errNo: 0,
          errStr: 'success',
          data: ret
        });
      });
    });
    // dbconn.end();
  } else {
    callback && callback('pn or rn is not a number!');
  }

}