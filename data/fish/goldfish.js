export default {
  id: 'goldfish',
  card: {
    url: '/images/金鱼.jpg',
    desc: '金鱼',
    info: {
      habitat: '冷水鱼，适宜水温18-22℃',
      tips: '过度投喂会导致失鳔症！'
    },
    tags: [
      {
        text: '新手友好',
        theme: 'primary',
      },
      {
        text: '群养',
        theme: 'success',
      },
      {
        text: '杂食性',
        theme: 'warning',
      },
    ],
  },
  detail: {
    name: '金鱼',
    scientificName: 'Carassius auratus',
    images: [
      '/images/goldfish/1.png',
      '/images/goldfish/2.png'
    ],
    description: '金鱼是最受欢迎的观赏鱼之一，起源于中国...',
    careGuide: {
      waterParameters: {
        temperature: '18-22℃',
        pH: '6.5-7.5',
        hardness: '5-19°dH'
      },
      tankSize: '至少30升/条',
      diet: ['优质金鱼饲料', '水蚤', '小型甲壳类'],
      commonDiseases: [
        {
          name: '失鳔症',
          symptoms: '游姿不稳，上浮或下沉',
          prevention: '控制投喂量，保持水质'
        }
      ]
    },
    breedingInfo: {
      difficulty: '中等',
      spawningTemp: '20-23℃',
      eggHatchTime: '48-72小时'
    }
  }
}; 