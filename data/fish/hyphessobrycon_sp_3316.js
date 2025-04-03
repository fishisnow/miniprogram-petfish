export default {
  id: 'yidianhong',
  card: {
    url: '/images/fish/一点红.jpg',
    desc: '巴西一点红',
    info: {
      habitat: '原产巴西玛瑙斯，适宜水温24-28℃，弱酸性软水', 
      tips: '建议每10升水饲养1-2条，群养效果更佳'
    },
    tags: ['新手友好', '群游性']
  },
  detail: {
    name: '巴西一点红',
    scientificName: 'Hyphessobrycon sp.',
    description: [
      '头型较短且窄长，体色青中带黄',
      '胸斑大且呈圆形，雄鱼脂鳍呈现红色',
      '与哥伦比亚品种相比体型更修长'
    ],
    careGuide: {
      waterParameters: {
        temperature: '24-28℃',  
        pH: '5.5-6.8',          
        hardness: '4-8°dH'   
      },
      tankSize: '最小40厘米缸（60升）',      
      diet: ['人工薄片', '冷冻血虫', '微颗粒饲料'],        
      commonDiseases: [     
        {
          name: '白点病',
          symptoms: '体表白点增生', 
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