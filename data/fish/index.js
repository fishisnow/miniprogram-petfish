import { getAllFish, getFishById } from './fish-registry';
import { popularFishIds } from './popular-fish';

// 获取所有鱼类数据
export const fishList = getAllFish();

// 获取随机鱼类数据
export const getRandomFish = (count = 1) => {
  const shuffled = [...fishList].sort(() => 0.5 - Math.random());
  return count === 1 ? shuffled[0] : shuffled.slice(0, count);
};

// 获取最受欢迎的鱼类数据
export const getPopularFish = () => {
  // 根据popularFishIds中的ID顺序获取鱼类数据
  const popularFish = popularFishIds
    .map(id => getFishById(id))
    .filter(fish => fish !== undefined); // 过滤掉不存在的鱼类
  
  return popularFish;
};

// 首页卡片列表接口
export const homeCards = {
  path: '/home/cards',
  data: {
    code: 200,
    message: '请求成功',
    data: fishList.map(fish => {
      return {
        ...fish.card,
        id: fish.id // 确保每个卡片数据都包含鱼的ID
      };
    })
  }
};

// 首页最受欢迎鱼类列表接口
export const popularCards = {
  path: '/home/popular',
  data: {
    code: 200,
    message: '请求成功',
    data: getPopularFish().map(fish => {
      return {
        ...fish.card,
        id: fish.id
      };
    })
  }
};

// 详情页接口
export const fishDetail = {
  path: '/fish/detail/:id',
  data: (params) => {
    console.log('详情页请求参数:', params);
    console.log('参数类型:', typeof params);
    console.log('参数内容:', JSON.stringify(params));
    
    let fishId = params;
    // 处理不同的参数格式
    if (typeof params === 'object' && params !== null) {
      fishId = params.id;
    }
    
    console.log('尝试查找鱼类ID:', fishId);
    
    // 记录所有可用的鱼类ID
    console.log('可用的鱼类ID列表:', fishList.map(fish => fish.id).join(', '));
    
    const fish = getFishById(fishId);
    console.log('查找到的鱼类数据:', fish ? '找到' : '未找到', fish ? fish.id : '无');
    
    if (fish) {
      // 处理详情数据，确保格式正确
      const detailData = { ...fish.detail };
      
      // 1. 处理图片 - 创建images数组，包含卡片图片
      detailData.images = [fish.card.url];
      
      // 2. 确保description是数组格式
      if (detailData.description && typeof detailData.description === 'string') {
        detailData.description = [detailData.description];
      }
      
      // 返回完整格式的响应
      return {
        code: 200,
        success: true,
        message: '请求成功',
        data: detailData
      };
    } else {
      // 返回错误响应
      return {
        code: 404,
        success: false,
        message: `未找到ID为"${fishId}"的鱼类`,
        data: null
      };
    }
  }
};

export default [homeCards, popularCards, fishDetail]; 