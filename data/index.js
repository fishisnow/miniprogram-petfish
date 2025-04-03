import Mock from './WxMock';
import config from '~/config';
// 导入包含path和data的对象
import loginMock from './login/index';
import homeMock from './home/index';
import searchMock from './search/index';
import dataCenter from './dataCenter/index';
import my from './my/index';
import fishMock from './fish/index';

const { baseUrl } = config;

export default () => {
  // 在这里添加新的mock数据
  const mockData = [...loginMock, ...homeMock, ...searchMock, ...dataCenter, ...my, ...fishMock];
  
  mockData.forEach((item) => {
    // 对于普通路径
    if (!item.path.includes(':')) {
      // 使用完整 URL 进行 mock
      const fullPath = `${baseUrl}${item.path}`;
      console.log(`注册普通路径: ${fullPath}`);
      Mock.mock(fullPath, { code: 200, success: true, data: item.data });
    } else {
      // 对于带参数的路径，如 /fish/detail/:id
      const pathPattern = item.path.replace(/:\w+/g, '([^/]+)');
      const fullPattern = baseUrl + pathPattern;
      const regexPattern = new RegExp(fullPattern);
      
      console.log(`注册参数化路径: ${fullPattern}, 正则: ${regexPattern}`);
      
      // 使用正则表达式来匹配URL
      Mock.mock(regexPattern, (options) => {
        console.log(`接收到匹配的请求: ${options.url}`);
        
        // 从URL中提取参数
        const path = options.url.replace(baseUrl, '');
        const originalPathRegex = new RegExp(pathPattern);
        const paramMatches = path.match(originalPathRegex);
        
        console.log(`路径部分: ${path}`);
        console.log(`参数匹配结果:`, paramMatches);
        
        // 构建参数对象
        const params = {};
        if (paramMatches && paramMatches.length > 1) {
          const paramNames = item.path.match(/:\w+/g);
          if (paramNames) {
            paramNames.forEach((param, index) => {
              params[param.substring(1)] = paramMatches[index + 1];
            });
          }
          
          console.log(`解析的参数:`, params);
          
          // 调用原始的数据处理函数或返回静态数据
          return typeof item.data === 'function' 
            ? item.data(params)
            : { code: 200, success: true, data: item.data };
        }
        
        return { code: 404, success: false, data: null };
      });
    }
  });
};
