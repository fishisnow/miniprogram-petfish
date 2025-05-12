# 七牛云图片上传工具

该工具用于将微信小程序中的鱼类图片上传到七牛云，并更新JS文件中的图片URL引用。

## 使用说明

1. 首先安装依赖：

```bash
cd scripts
npm install
```

2. 修改 `qiniu-uploader.js` 中的七牛云配置：

```javascript
// 七牛云配置
const config = {
  accessKey: 'YOUR_ACCESS_KEY',  // 替换为你的七牛云AccessKey
  secretKey: 'YOUR_SECRET_KEY',  // 替换为你的七牛云SecretKey
  bucket: 'YOUR_BUCKET_NAME',    // 替换为你的存储空间名称
  zone: 'Zone_z0',               // 根据存储空间所在区域选择：z0华东, z1华北, z2华南, na0北美, as0东南亚
  domain: 'YOUR_DOMAIN'          // 替换为你的七牛云域名，如 http://example.cdn.com/ (必须以斜杠结尾)
};
```

3. 运行脚本上传图片：

```bash
npm start
```

## 注意事项

- 确保所有配置信息正确，否则上传将会失败
- 脚本会自动跳过已经使用七牛云地址的文件
- 上传结果会保存在 `qiniu-upload-log.json` 中，方便后续查看和验证
- 如果运行过程中出现错误，请查看控制台输出的错误信息

## 工作流程

1. 脚本会扫描 `data/fish` 目录下的所有JS文件
2. 从每个JS文件中提取图片URL
3. 根据URL在 `images/fish` 目录中找到对应的图片文件
4. 将图片上传到七牛云
5. 更新JS文件中的URL为七牛云地址
6. 保存上传记录到日志文件 