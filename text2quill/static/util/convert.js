/*
 * Copyright (c) 2014-2016 Zuoyebang, All rights reseved.
 * @fileoverview 页面模板主框架
 * @author wangyan01 | wangyan01@zuoyebang.com
 * @version 1.0 | 2016-07-28 | wangyan01   // Initial version. 
 *
 */

!function(window, MathQuill) {
  var MQ = MathQuill.getInterface(2);

  var Generator = {
    getInterface: function(no) {
      switch(no) {
        // 逐个公式转换
        case 1:
          var regExp1 = /\\placeholder/g,
            regExp2 = /(?:\\left)|(?:\\right)/g,
            regExp3 = /(?:\\begin{aligned}\[t\])|(?:\\end{aligned})/g,
            regExp4 = /\&gt;/g,
            regExp5 = /\&lt;/g,
            regExp6 = /\\,/g;
          return {
            preProcess: function(str) {
              return str.replace(regExp1, '')
                .replace(regExp2, '')
                .replace(regExp3, '')
                .replace(regExp4, '\>')
                .replace(regExp5, '\<')
                .replace(regExp6, '');
            },
            processHTML: function(html) {
              var self = this;
              return html.replace(/\$.*?\$/g, function(str){
                str = str.slice(1, -1);
                // 换行检测
                var lines = str.split(/\\+?&/);
                if(lines.length > 1) {
                  var newStr = '';
                  for(var i = 0; i < lines.length; i++) {
                    if(i <= 1) {
                      newStr += self.processHTML('$' + lines[i] + '$');
                    } else {
                      newStr += '<p>' + self.processHTML('$' + lines[i] + '$') + '</p>';
                    }
                  }
                  return newStr;
                } else {
                  return MQ.StaticMath(self.getDOM(self.preProcess(str))).el().outerHTML;
                }
              });
            },
            getDOM: function(str) {
              return $('<span class="formula">' + str + '</span>').get(0);
            }
          }
          break;
        // 完整html直接转换
        case 2:
          var regExp1 = /\\placeholder/g,
            regExp2 = /(?:\\left)|(?:\\right)/g;
          return {
            preProcess: function(str) {
              return str.replace(regExp1, '')
                .replace(regExp2, '');
            },
            processHTML: function(html) {
              var self = this,
                htmlEle = self.getDOM(html.replace(/\$.*?\$/g, function(str){
                  str = str.slice(1, -1);
                  return self.preProcess(str);
                }));
              return MQ.StaticMath(htmlEle).el().outerHTML;
            },
            getDOM: function(str) {
              return $('<div class="container inline-div">' + str + '</div>').get(0);
            }
          }
          break;
      }
    }
  };
  window.Generator = Generator;
}(window, MathQuill);