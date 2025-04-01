import balloonMolly from './balloon_molly';
import trafficLightFish from './traffic_light_fish';
import blueRam from './blue_ram';
import mickeyMousePlaty from './mickey_mouse_platy';
import zebraDanio from './zebra_danio';

// 将所有鱼类数据放入数组
export const fishList = [
  balloonMolly,
  trafficLightFish,
  blueRam,
  mickeyMousePlaty,
  zebraDanio
];

// 获取随机鱼类数据
export const getRandomFish = (count = 1) => {
  const shuffled = [...fishList].sort(() => 0.5 - Math.random());
  return count === 1 ? shuffled[0] : shuffled.slice(0, count);
};

// 首页卡片列表接口
export const homeCards = {
  path: '/home/cards',
  data: {
    code: 200,
    message: '请求成功',
    data: fishList.map(fish => fish.card)
  }
};

// 详情页接口
export const fishDetail = {
  path: '/fish/detail/:id',
  data: (params) => {
    const fish = fishList.find(f => f.id === params.id);
    return {
      code: 200,
      message: '请求成功',
      data: fish ? fish.detail : null
    };
  }
};

export default [homeCards, fishDetail]; 