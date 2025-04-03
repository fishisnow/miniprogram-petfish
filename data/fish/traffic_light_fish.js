export default {
  id: 'traffic_light_fish',
  card: {
    url: '/images/fish/红绿灯鱼.jpeg',
    desc: '红绿灯鱼',
    info: {
      habitat: '热带鱼，适宜水温22-28℃',
      tips: '对水质要求不高，适合新手饲养'
    },
    tags: ['新手友好', '群养', '小型鱼'],
  },
  detail: {
    name: '红绿灯鱼',
    scientificName: 'Thayeria boehlkei',
    images: ['/images/fish/traffic_light/1.png', '/images/fish/traffic_light/2.png'],
    description: '红绿灯鱼体型小巧，体侧有一条明显的黑色斜带，游动时像红绿灯一样闪烁。',
    careGuide: {
      waterParameters: {
        temperature: '22-28℃',
        pH: '6.0-7.5',
        hardness: '5-15°dH'
      },
      tankSize: '至少30升/群',
      diet: ['小型鱼饲料', '水蚤', '蚊子幼虫'],
      commonDiseases: [
        {
          name: '车轮虫病',
          symptoms: '鱼体表面出现白色斑点，类似棉花',
          prevention: '定期换水，保持水质'
        }
      ]
    },
    breedingInfo: {
      difficulty: '中等',
      spawningTemp: '24-26℃',
      eggHatchTime: '24-36小时'
    }
  }
}; 