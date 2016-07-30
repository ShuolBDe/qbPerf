//打点逻辑

!function(window) {

  var Tools = {
    sendLog: sendLog,
    webPerf: new WebPerf()
  };

  // 打点逻辑
  function sendLog(data){
    var url = JSON.stringify(extend({
      module: 'hypertext2quill',
      page: 'formula',
      type: 'perf',
      notice: 'go'
    }, data)).replace(/^\{|(\}$|\")/g, '').replace(/:/g, '=').replace(/,/g, '&');
    new Image().src = 'http://www.zybang.com/napi/stat/addnoticev1?' + url;
  }

  // 扩展对象方法
  function extend(retData, extData) {
    for(var key in extData) {
      retData[key] = extData[key];
    }
    return retData;
  }

  // performance
  function WebPerf() {
    this.timing = performance.timing;
  }

  // resource is to be fetched using Http or cache
  WebPerf.prototype.fetchStart = function() {
    return this.timing.fetchStart;
  }
  // User-perceived pageloading time
  WebPerf.prototype.pageLoadTiming = function(onloadTiming) {
    return onloadTiming - this.timing.navigationStart;
  }
  // domain lookup timing
  WebPerf.prototype.domainLookupTiming = function() {
    return this.timing.domainLookupEnd - this.timing.domainLookupStart;
  }
  // connection establish timing
  WebPerf.prototype.connectTiming = function() {
    return this.timing.connectEnd - this.timing.connectStart;
  }
  // from receive the first byte to the last byte
  WebPerf.prototype.responseTiming = function() {
    return this.timing.responseEnd - this.timing.responseStart;
  }
  // readyState from current_document_readiness to loading
  WebPerf.prototype.domLoading = function () {
    return this.timing.domLoading - this.timing.fetchStart;
  }
  // readyState from current_document_readiness to interactive
  WebPerf.prototype.domInteractive = function () {
    return this.timing.domInteractive - this.timing.fetchStart;
  }
  // ua fires domcontentloaded event
  WebPerf.prototype.domContentLoadedEventStart = function() {
    return this.timing.domContentLoadedEventStart - this.timing.fetchStart;
  }
  // domContentLoaded timing
  WebPerf.prototype.domContentLoadedEventTiming = function() {
    return this.timing.domContentLoadedEventEnd - this.timing.domContentLoadedEventStart;
  }
  // readyState from current_document_readiness to complete
  WebPerf.prototype.domComplete = function() {
    return this.timing.domComplete - this.timing.fetchStart;
  }

  window.Tools = Tools;
}(window);