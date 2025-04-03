# 鱼类数据自动注册系统

这个系统用于自动化管理鱼类数据文件的导入和注册过程，解决了手动维护大量鱼类数据导入的问题。

## 工作原理

1. 使用 `generate-fish-imports.js` 脚本扫描 `data/fish` 目录中的所有鱼类数据文件
2. 自动生成 `fish-registry.js` 注册表文件，包含所有鱼类的导入和注册
3. `index.js` 使用注册表文件中的函数来访问鱼类数据

## 使用方法

### 添加新鱼类

1. 在 `data/fish` 目录中创建新的鱼类数据文件（如 `new_fish.js`）
2. 运行脚本更新注册表：
   ```
   npm run update-fish
   ```
3. 完成！新的鱼类已经自动添加到系统中

### 在代码中使用

在代码中，您可以使用 `fish-registry.js` 提供的函数来访问鱼类数据：

```javascript
import { getAllFish, getFishById, getFishByKey } from '../data/fish/fish-registry';

// 获取所有鱼类
const allFish = getAllFish();

// 根据ID获取特定鱼类
const fish = getFishById('fish001');

// 根据文件名获取特定鱼类
const goldfish = getFishByKey('goldfish');
```

## 自动化

我们已经配置了 `predev` 脚本，每次运行开发服务器前会自动更新鱼类注册表。

## 注意事项

1. 脚本会自动忽略 `index.js`、`template.js` 和 `fish-registry.js` 文件
2. 确保每个鱼类数据文件都默认导出一个完整的鱼类对象
3. 文件名会自动转换为驼峰命名作为导入变量名
4. 如果手动修改了 `fish-registry.js`，再次运行脚本会覆盖您的修改 