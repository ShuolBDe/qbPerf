/*
 * Copyright (c) 2014-2016 Zuoyebang, All rights reseved.
 * @fileoverview 转换批处理
 * @author wangyan01 | wangyan01@zuoyebang.com
 * @version 1.0 | 2016-07-28 | wangyan01   // Initial version. 
 *
 */

var pn = 1,
  rn = 10,
  hyperText = new Array();

var GR = Generator.getInterface(1),
  iframe = $('#notice');

function getHyperText(pn, rn, getAll, callback) {
  return new Promise((resolve, reject) => {
    $.post('http://127.0.0.1:3000/gethypertext', {
      pn: pn,
      rn: rn
    }, function(res) {
      if (res.data) {
        // Array.prototype.push.apply(hyperText, res.data);
        if (getAll && res.hasMore) {
          if (callback) {
            callback(res.data).then(() => {
              getHyperText(++pn, rn, 1, callback);
            });
          } else {
            getHyperText(++pn, rn, 1);
          }
        }
        resolve(res.data);
      } else {
        reject();
      }
    });
  });
}

function convert(array) {
  var data = array.map(function(cur, index) {
    cur.content = GR.processHTML(cur.hyperText);
    delete cur.hyperText;
    return cur;
  });
  return new Promise((resolve, reject) => {
    $.post('http://127.0.0.1:3000/updatecontent', {
      data: data
    }, function(res) {
      if (res.errNo == 0) {
        console.log('covert success');
        resolve();
      } else {
        reject();
      }
    });
  });
}

function getAnchorList(array) {
  var ul = document.createElement('ul');
  $(ul).addClass('anchor-list');
  for (var i in array) {
    var li = document.createElement('li'),
      anchor = document.createElement('a');
    $(anchor).text(array[i]).attr('href', array[i]).attr('target', '_blank');
    $(li).append(anchor);
    $(ul).append(li);
  }
  $('.panel').append(ul);
}

function generate(pn, rn, isAll) {
  $.post('http://127.0.0.1:3000/writefiles', {
    pn: pn,
    rn: rn,
    isAll: isAll || 0
  }, function(res) {
    if (res.errNo == 0) {
      console.log('generate finished!');
      console.log(res.data);
      getAnchorList(res.data);
    } else {
      console.log(res.errStr || '好像出了点问题');
    }
  });
}

function getUrl(pn, rn) {
  return new Promise((resolve, reject) => {
    $.post('http://127.0.0.1:3000/geturl', {
      pn: pn,
      rn: rn
    }, function(res) {
      if(res.errNo == 0) {
        resolve(res.data);
      } else {
        reject(res.errStr);
      }
    });
  })
}

function refreshNotice(data, delay) {
  var length = data.data.length;
  return new Promise((resolve, reject) => {
    var timer = setInterval(() => {
      if(--length < 0) {
        clearInterval(timer);
        resolve();
      } else {
        iframe.attr('src', data.data[length].url);
      }
    }, delay || 5000);
  });
}

function looper(loop) {
  console.log('loop');
  getUrl(pn++, rn).then( (data) => {
    if(loop == undefined || !isFinite(loop) && data.hasMore) {
      refreshNotice(data).then(() => {
        looper();
      });
    } else if(isFinite(loop) && loop > 0) {
      refreshNotice(data).then(() => {
        looper(--loop);
      });
    }
  });
}

$('.get').on('click', function() {
  switch ($(this).attr('cmd')) {
    case '10':
      hyperText.length = 0;
      getHyperText(1, 10);
      break;
    case '100':
      hyperText.length = 0;
      var counts = 1;
      while (counts <= 100 / 10) {
        getHyperText(counts++, 10);
      }
      break;
    case 'all':
      hyperText.length = 0;
      getHyperText(pn, rn, 1);
      break;
  }
});

$('.convert').on('click', function() {
  switch ($(this).attr('cmd')) {
    case '10':
      hyperText.length = 0;
      getHyperText(1, 10).then( (array) => {
        convert(array);
      });
      break;
    case '100':
      hyperText.length = 0;
      var counts = 1;
      while (counts <= 100 / 10) {
        getHyperText(counts++, 10).then( (array) => {
          convert(array);
        });
      }
      break;
    case 'all':
      hyperText.length = 0;
      pn = 1, rn = 10;
      getHyperText(pn, rn, 1, convert);
      break;
  }
});

// 后端使用随机数生成文件，如无必要，不要重复请求接口
$('.generate').on('click', function() {
  switch ($(this).attr('cmd')) {
    case '10':
      generate(1, 10);
      break;
    case '100':
      var counts = 1;
      while (counts <= 100 / 10) {
        generate(counts++, 10);
      }
      break;
    case 'all':
      generate(0, 0, 1);
      break;
  }
});

$('.refresh').on('click', function() {
  switch ($(this).attr('cmd')) {
    case '10':
      looper(1);
      break;
    case '100':
      var counts = 1;
      looper(100/10);
      break;
    case 'all':
      pn = 1, rn = 10;
      looper();
      break;
  }
});