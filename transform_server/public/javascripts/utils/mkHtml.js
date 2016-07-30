var fs = require('fs');
var jade = require('jade');
var path = require('path');

var render = jade.compileFile(path.join(__dirname, '../../../views/formula.jade'));

module.exports = function(content) {
  var name = Math.ceil(Math.random() * 10000000);
  var content = render({content: content || '<div>no richText or Latex</div>'});
  // console.log('\n-----------\n' + content + '\n-----------\n');
  fs.open(path.join(__dirname, '../../resource/pages/') + name + '.html', 'w+', (err, fd) => {
    if(err) {
      console.log(err);
    } else {
      fs.write(fd, content);
    }
  });
  return 'http://127.0.0.1:3000/resource/pages/' + name + '.html';
}