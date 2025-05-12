const fs = require('fs');
const path = require('path');
const qiniu = require('qiniu');
const glob = require('glob');

// 七牛云配置
const config = {
  accessKey: '',
  secretKey: '',
  bucket: 'fishisnow',
  zone: 'z2', // 根据你的空间所在区域选择：z0华东, z1华北, z2华南, na0北美, as0东南亚
  domain: 'https://up-z2.qiniup.com' // 您的七牛云域名，如 http://example.cdn.com/
};

// 初始化七牛SDK
const mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);
const qiniuConfig = new qiniu.conf.Config();
qiniuConfig.zone = qiniu.zone[config.zone];
const bucketManager = new qiniu.rs.BucketManager(mac, qiniuConfig);
const formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
const putExtra = new qiniu.form_up.PutExtra();

// 文件路径配置
const fishDataDir = path.resolve(__dirname, '../data/fish');
const fishImagesDir = path.resolve(__dirname, '../images/fish');

// 记录上传结果
const uploadResults = {};

/**
 * 上传单个文件到七牛云
 * @param {string} localFile - 本地文件路径
 * @param {string} key - 上传到七牛后的文件名
 * @returns {Promise<string>} - 返回上传后的文件URL
 */
function uploadFile(localFile, key) {
  return new Promise((resolve, reject) => {
    // 生成上传凭证
    const options = {
      scope: `${config.bucket}:${key}`,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);

    // 上传文件
    formUploader.putFile(uploadToken, key, localFile, putExtra, (err, body, info) => {
      if (err) {
        return reject(err);
      }
      
      if (info.statusCode === 200) {
        const fileUrl = `${config.domain}${key}`;
        console.log(`上传成功: ${localFile} -> ${fileUrl}`);
        resolve(fileUrl);
      } else {
        reject(new Error(`上传失败: ${info.statusCode} ${info.statusMessage}`));
      }
    });
  });
}

/**
 * 更新JS文件中的图片URL
 * @param {string} jsFilePath - JS文件路径
 * @param {string} oldUrl - 旧URL
 * @param {string} newUrl - 新URL
 */
function updateJsFile(jsFilePath, oldUrl, newUrl) {
  try {
    let content = fs.readFileSync(jsFilePath, 'utf8');
    const updatedContent = content.replace(oldUrl, newUrl);
    
    if (content !== updatedContent) {
      fs.writeFileSync(jsFilePath, updatedContent, 'utf8');
      console.log(`已更新文件: ${jsFilePath}`);
      return true;
    } else {
      console.log(`文件无需更新: ${jsFilePath}`);
      return false;
    }
  } catch (error) {
    console.error(`更新文件失败: ${jsFilePath}`, error);
    return false;
  }
}

/**
 * 处理所有鱼类数据文件
 */
async function processAllFishFiles() {
  try {
    // 获取所有JS文件
    const jsFiles = glob.sync(`${fishDataDir}/**/*.js`);
    
    for (const jsFile of jsFiles) {
      try {
        // 读取JS文件内容
        const content = fs.readFileSync(jsFile, 'utf8');
        
        // 使用正则表达式提取图片URL
        const urlMatch = content.match(/url:\s*['"]([^'"]+)['"]/);
        if (!urlMatch || !urlMatch[1]) {
          console.log(`在文件 ${jsFile} 中未找到图片URL`);
          continue;
        }
        
        const oldUrl = urlMatch[1];
        
        // 如果URL已经是七牛云地址，则跳过
        if (oldUrl.includes(config.domain)) {
          console.log(`文件 ${jsFile} 已使用七牛云地址`);
          continue;
        }
        
        // 根据oldUrl找到本地图片文件
        const imageName = path.basename(oldUrl);
        const localImagePath = path.join(fishImagesDir, imageName);
        
        if (!fs.existsSync(localImagePath)) {
          console.error(`未找到图片文件: ${localImagePath}`);
          continue;
        }
        
        // 定义上传到七牛云的文件名
        const key = `fish/${imageName}`;
        
        // 如果已经上传过该图片，直接使用上传结果
        if (uploadResults[key]) {
          console.log(`使用缓存的上传结果: ${key}`);
          updateJsFile(jsFile, oldUrl, uploadResults[key]);
          continue;
        }
        
        // 上传图片到七牛云
        console.log(`正在上传 ${localImagePath} 到七牛云...`);
        const newUrl = await uploadFile(localImagePath, key);
        
        // 保存上传结果
        uploadResults[key] = newUrl;
        
        // 更新JS文件中的URL
        updateJsFile(jsFile, oldUrl, newUrl);
        
      } catch (error) {
        console.error(`处理文件出错: ${jsFile}`, error);
      }
    }
    
    console.log('所有文件处理完成!');
  } catch (error) {
    console.error('处理过程中发生错误:', error);
  }
}

// 创建用于保存上传结果的日志文件
function saveUploadLog() {
  const logPath = path.resolve(__dirname, 'qiniu-upload-log.json');
  fs.writeFileSync(logPath, JSON.stringify(uploadResults, null, 2), 'utf8');
  console.log(`上传记录已保存至: ${logPath}`);
}

// 主函数
async function main() {
  console.log('开始处理文件...');
  await processAllFishFiles();
  saveUploadLog();
  console.log('任务完成!');
}

// 检查必要的配置
function checkConfig() {
  const requiredFields = ['accessKey', 'secretKey', 'bucket', 'domain'];
  const missingFields = requiredFields.filter(field => 
    !config[field] || config[field] === `YOUR_${field.toUpperCase()}`
  );
  
  if (missingFields.length > 0) {
    console.error('缺少必要的配置:', missingFields.join(', '));
    console.error('请更新脚本中的配置信息后再运行');
    return false;
  }
  
  return true;
}

// 启动程序
if (checkConfig()) {
  main().catch(console.error);
} else {
  process.exit(1);
} 