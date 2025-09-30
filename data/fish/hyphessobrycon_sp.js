export default {
  id: 'landandeng',
  card: {
    url: 'http://img.fishisnow.xyz/fish/蓝带灯.jpg',
    desc: '蓝带灯',
    info: {
      habitat: '申古流域（Rio Xingu）→ 水温24-28℃，弱酸性软水', 
      tips: '建议饲养密度为每10升水1-2条'
    },
    tags: ['新手友好', '活泼好动', '易肥胖']
  },
  detail: {
    name: '蓝带灯',
    scientificName: 'Hyphessobrycon sp.',
    description: [
      '体长约3公分，体型小巧',
      '背部呈淡银蓝色，体侧有醒目黄色亮带',
      '黄带下方伴生深蓝色纵带，形成鲜明对比'
    ],
    careGuide: {
      waterParameters: {
        temperature: '24-28℃',  
        pH: '5.5-7.0',          
        hardness: '4-8°dH'   
      },
      tankSize: '最小30升水体',
      diet: ['小型颗粒饲料', '冷冻红虫', '丰年虾'],
      commonDiseases: [
        {
          name: '肥胖症',
          symptoms: '腹部异常膨大，游动迟缓', 
          prevention: '控制喂食量，每周安排1天停食日'
        }
      ]
    },
    breedingInfo: {         
      difficulty: '中等', 
      spawningTemp: '26℃',
      eggHatchTime: '2-3天',
      specialRequirements: '需要茂密水草作为产卵介质'
    }
  }
}