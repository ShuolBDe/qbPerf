window.onload = function() {
  var now = Date.now();
  var WebPerf = Tools.webPerf;
  var data = {
    fetchStart: WebPerf.fetchStart(),
    pageLoadTiming: WebPerf.pageLoadTiming(now),
    domainLookupTiming: WebPerf.domainLookupTiming(),
    connectTiming: WebPerf.connectTiming(),
    responseTiming: WebPerf.responseTiming(),
    domLoading: WebPerf.domLoading(),
    domInteractive: WebPerf.domInteractive(),
    domContentLoadedEventStart: WebPerf.domContentLoadedEventStart(),
    domContentLoadedEventTiming: WebPerf.domContentLoadedEventTiming(),
    domComplete: WebPerf.domComplete()
  };
  Tools.sendLog(data);
}