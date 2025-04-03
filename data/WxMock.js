/* eslint-disable */
var __request = wx.request;
var Mock = require('./data.js');
Object.defineProperty(wx, 'request', { writable: true });
wx.request = function (config) {
  console.log('拦截请求:', config.url);
  
  // 首先尝试直接匹配
  if (typeof Mock._mocked[config.url] !== 'undefined') {
    console.log('找到完全匹配的 mock:', config.url);
    var resTemplate = Mock._mocked[config.url].template;
    var response = Mock.mock(resTemplate);
    if (typeof config.success === 'function') {
      config.success(response);
    }
    if (typeof config.complete === 'function') {
      config.complete(response);
    }
    return;
  }
  
  // 尝试匹配带参数的 URL 模式
  var found = false;
  for (var key in Mock._mocked) {
    if (Mock._mocked.hasOwnProperty(key)) {
      var mockItem = Mock._mocked[key];
      if (mockItem.rurl instanceof RegExp && mockItem.rurl.test(config.url)) {
        console.log('找到正则匹配的 mock:', key, '对应URL:', config.url);
        found = true;
        
        var templateFn = mockItem.template;
        var response;
        
        if (typeof templateFn === 'function') {
          response = templateFn({
            url: config.url,
            type: config.method || 'GET',
            body: config.data
          });
        } else {
          response = Mock.mock(templateFn);
        }
        
        if (typeof config.success === 'function') {
          config.success({ data: response });
        }
        if (typeof config.complete === 'function') {
          config.complete({ data: response });
        }
        break;
      }
    }
  }
  
  // 如果没有找到匹配的 mock，则使用原始的 request 函数
  if (!found) {
    console.warn('没有找到匹配的 mock，使用原始请求:', config.url);
    __request(config);
  }
};
module.exports = Mock;
