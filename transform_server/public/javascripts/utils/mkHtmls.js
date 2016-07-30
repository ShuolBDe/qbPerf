'use strict';
var dbconn = require('../dbconnection/connectPool');
var mkHtml = require('./mkHtml');

var query = 'SELECT tid, content FROM latex limit ?,?',
  queryAll = 'SELECT tid, content FROM latex',
  update = 'UPDATE latex SET url = ? WHERE tid = ?';

// pn 页码(从1开始), rn单页条目数
module.exports = (pn, rn, isAll) => {
  var pn = parseInt(pn),
    rn = parseInt(rn);

  return new Promise((resolve, reject) => {
    var qy = isAll != '0' ? queryAll : query;
    var data = isAll != '0' ? null: [(pn - 1) * rn, rn];
    var urlList = new Array();

    dbconn.query(qy, data, (err, rows, fields) => {
      if(err) {
        console.log('mkHtmls err: ' + err);
        reject({
          errNo: 1,
          errStr: err
        });
      } else {
        for(let i in rows) {
          let url = mkHtml(rows[i].content);
          dbconn.query(update, [url, rows[i].tid], (err, result) => {
            if(err) {
              console.log(err);
            }
          });
          urlList.push(url);
        }
      }
      resolve({
        errNo: 0,
        errStr: 'success',
        data: urlList
      });
    });
  });
}