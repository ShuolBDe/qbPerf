var parser = require('csv').parse({delimiter: ','});
var fs = require('fs');
var path = require('path');
var dbconn = require('../dbconnection/connectPool');

var output = [];
var input = fs.createReadStream(path.join(__dirname, '../../resource/csv/fs_read.csv'));

module.exports = () => {
  // dbconn.connect();
  parser.on('readable', () => {
    while(record = parser.read()) {
      dbconn.query('INSERT INTO latex SET ?', {
        tid: record[0],
        content: record[5]
      }, (err, result) => {
        if(err) {
          console.log('dbconn err: ' + err);
        }
      });
      // console.log(record);
    }
  });
  input.pipe(parser);
}