'use strict';
var dbconn = require('../dbconnection/connectPool');

function process(data) {
  return new Promise((resolve, reject) => {
    dbconn.query('UPDATE latex SET content = ? WHERE tid = ?', [
      // dbconn.query('SELECT * FROM latex WHERE tid = ?', [
      data.content,
      data.tid
    ], (err, results) => {
      if(err) {
        console.log('update content err: ' + err);
        reject();
      } else {
        resolve();
      }
    });
  });
}

function batch(array, loop, resv) {
  return new Promise((resolve, reject) => {
    resv && resv();
    if(loop >= 0) {
      try {
        process(array[loop--]).then(() => {
          batch(array, loop, resolve);
        });
      } catch(e) {
        reject(e);
      }
    } else {
      resolve();
    }
  });
}

module.exports = (array, callback) => {
  if(!(array instanceof Array)) {
    array = [array];
  }
  batch(array, array.length - 1).then(() => {
    callback && callback({errNo: 0, errStr: 'success'});
  });
}