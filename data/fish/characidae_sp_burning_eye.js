export default {
  id: 'hongmugongzhudeng',
  card: {
    url: '/images/fish/红目公主灯.jpg',
    desc: '红目公主灯',
    info: {
      habitat: '秘鲁流域 → 温度24-28℃/弱酸性软水', 
      tips: '建议10条以上群养，每升水配1cm鱼体'
    },
    tags: ['新手友好', '群游性']
  },
  detail: {
    name: '红目公主灯',
    scientificName: 'Characidae sp. burning eye',
    description: [
      '体长5cm左右，具有圆大的红色眼睛',
      '乳白色晶莹剔透的体色，背部泛蓝光',
      '缺乏闪鳞特征，与钻石灯外形相似但更素雅'
    ],
    careGuide: {
      waterParameters: {
        temperature: '24-28℃',  
        pH: '5.5-6.8',          
        hardness: '4-8°dH'   
      },
      tankSize: '最小40升',      
      diet: ['小型颗粒饲料', '冷冻血虫', '丰年虾'],        
      commonDiseases: [     
        {
          name: '白点病',
          symptoms: '体表白点增生、摩擦物体', 
          prevention: '保持水质稳定，新鱼入缸前检疫'
        }
      ]
    },
    breedingInfo: {         
      difficulty: '中等', 
      spawningTemp: '26-28℃',
      eggHatchTime: '36-48小时',
      specialRequirements: '需要茂密水草作为产卵床'
    }
  }
}