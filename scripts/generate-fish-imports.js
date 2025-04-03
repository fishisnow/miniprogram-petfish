const fs = require('fs');
const path = require('path');

// 指定鱼类数据所在的目录
const fishDir = path.join(__dirname, '../data/fish');

// 获取目录中的所有 JS 文件
const files = fs.readdirSync(fishDir)
  .filter(file => file.endsWith('.js') && 
    file !== 'index.js' && 
    file !== 'template.js' && 
    file !== 'fish-registry.js');

// 生成导入语句
let importStatements = '';
let registryEntries = '';

files.forEach(file => {
  const name = file.replace('.js', '');
  const camelCaseName = name.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
  
  importStatements += `import ${camelCaseName} from './${name}';\n`;
  registryEntries += `  '${name}': ${camelCaseName},\n`;
});

// 生成完整的 fish-registry.js 文件内容
const registryContent = `// 此文件由脚本自动生成，请勿手动修改
// 鱼类注册表 - 将所有鱼类文件映射为键值对

${importStatements}
// 注册所有鱼类
export const fishRegistry = {
${registryEntries}};

// 获取所有鱼类列表
export const getAllFish = () => Object.values(fishRegistry);

// 根据ID获取鱼类
export const getFishById = (id) => {
  return Object.values(fishRegistry).find(fish => fish.id === id);
};

// 通过名称获取鱼类
export const getFishByKey = (key) => {
  return fishRegistry[key];
};

export default {
  fishRegistry,
  getAllFish,
  getFishById,
  getFishByKey
};
`;

// 写入文件
fs.writeFileSync(path.join(fishDir, 'fish-registry.js'), registryContent);

console.log('鱼类注册表文件已生成！'); 