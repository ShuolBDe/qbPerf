//打点逻辑

!function(window, $) {

  var Tools = {
    sendLog: function(data) {
      var url = JSON.stringify($.extend({
        module: 'text2quill',
        page: 'iframe'
      }, data)).replace(/^\{|(\}$|\")/g, '').replace(/:/g, '=').replace(/,/g, '&');
      new Image().src = 'http://www.zybang.com/napi/stat/addnoticev1?' + url;
    },
    webPerf: new WebPerf()
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
    return this.timing.loadEventEnd - this.timing.navigationStart;
  }
  // domain lookup timing
  WebPerf.prototype.domainLookupTiming = function() {
    return this.timing.domainLookupEnd - this.timing.domainLookupStart;
  }
  // connection establish timing
  WebPerf.prototype.connnectTiming = function() {
    return this.timing.connnectEnd - this.timing.connnectStart;
  }
  // from receive the first byte to the last byte
  WebPerf.prototype.responseTiming = function() {
    return this.timing.responseEnd - this.timing.responseStart;
  }
  // readyState from current_document_readiness to loading
  WebPerf.prototype.domLoading = function () {
    return this.timing.domLoading;
  }
  // readyState from current_document_readiness to interactive
  WebPerf.prototype.domInteractive = function () {
    return this.timing.domInteractive;
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
    return this.timing.domComplete;
  }

  window.Tools = Tools;
}(window, $);