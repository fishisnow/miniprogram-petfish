import { getAllFish } from '../data/fish/fish-registry';

// 创建搜索索引
const createSearchIndex = () => {
  console.log('开始创建搜索索引');
  const fishList = getAllFish();
  console.log('获取到鱼类列表，数量:', fishList.length);
  
  const searchIndex = fishList.map(fish => {
    const name = fish.detail.name;
    const scientificName = fish.detail.scientificName;
    // 处理description可能是字符串或数组的情况
    const description = Array.isArray(fish.detail.description) 
      ? fish.detail.description.join(' ')
      : fish.detail.description || '';
    // 处理tags可能是字符串或数组的情况
    const tags = Array.isArray(fish.card.tags)
      ? fish.card.tags.join(' ')
      : fish.card.tags || '';
    
    return {
      id: fish.id,
      name,
      scientificName,
      description,
      tags,
      searchText: `${name} ${scientificName} ${description} ${tags}`
    };
  });
  
  console.log('搜索索引创建完成，数量:', searchIndex.length);
  console.log('搜索索引示例:', searchIndex[0]);
  
  // 存储到本地
  wx.setStorageSync('fishSearchIndex', searchIndex);
  return searchIndex;
};

// 搜索函数
const searchFish = (keyword) => {
  console.log('开始搜索，关键词:', keyword);
  if (!keyword) return [];
  
  // 获取搜索索引
  let searchIndex = wx.getStorageSync('fishSearchIndex');
  console.log('从本地存储获取搜索索引:', searchIndex ? '成功' : '失败');
  
  if (!searchIndex) {
    console.log('本地存储中没有搜索索引，重新创建');
    searchIndex = createSearchIndex();
  }
  
  // 转换搜索关键词为小写
  const searchKey = keyword.toLowerCase();
  console.log('转换后的搜索关键词:', searchKey);
  
  // 搜索匹配
  const results = searchIndex.filter(item => 
    item.searchText.toLowerCase().includes(searchKey)
  ).map(item => item.id);
  
  console.log('搜索结果数量:', results.length);
  console.log('搜索结果:', results);
  
  return results;
};

// 初始化搜索索引
const initSearchIndex = () => {
  console.log('初始化搜索索引');
  if (!wx.getStorageSync('fishSearchIndex')) {
    console.log('本地存储中没有搜索索引，创建新的索引');
    createSearchIndex();
  } else {
    console.log('本地存储中已有搜索索引');
  }
};

export {
  initSearchIndex,
  searchFish,
  createSearchIndex
}; 