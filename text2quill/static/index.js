/*
 * Copyright (c) 2014-2016 Zuoyebang, All rights reseved.
 * @fileoverview 页面模板主框架
 * @author wangyan01 | wangyan01@zuoyebang.com
 * @version 1.0 | 2016-07-28 | wangyan01   // Initial version. 
 *
 */

var GR1 = Generator.getInterface(1),
  GR2 = Generator.getInterface(2);

$('.convertBtn').on('click', function() {
  var targetStr = $('#source').val();
  var GR = $(this).index() == 0 ? GR1 : GR2;
  if(targetStr.length) {
    var rendered = $('#rendered');
    rendered.html(GR.processHTML(targetStr));
  } else {
    alert('内容为空，无法convert');
  }
});