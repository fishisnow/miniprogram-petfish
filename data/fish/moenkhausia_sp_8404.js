export default {
  id: 'bai-jin-ban-wei-deng',
  card: {
    url: '/images/fish/白金斑尾灯.jpg',
    desc: '白金斑尾灯',
    info: {
      habitat: '哥伦比亚奥利诺科流域 → 水温24-28℃/弱酸性软水', 
      tips: '建议5-10条群养 → 每10升水饲养1条'
    },
    tags: ['进阶', '稀有品种', '上层活动']
  },
  detail: {
    name: '白金斑尾灯',
    scientificName: 'Moenkhausia sp.',
    description: [
      '体型修长带有白金特征',
      '体侧亮线呈暗绿色',
      '不对称尾斑：上叶黄黑白三色，下叶不明显'
    ],
    careGuide: {
      waterParameters: {
        temperature: '24-28℃',  
        pH: '5.5-6.8',          
        hardness: '4-8°dH'   
      },
      tankSize: '40升以上',      
      diet: ['小型活饵', '薄片饲料', '冷冻红虫'],        
      commonDiseases: [     
        {
          name: '白点病',
          symptoms: '体表白点增生', 
          prevention: '保持水质稳定+新鱼检疫'
        }
      ]
    },
    breedingInfo: {         
      difficulty: '困难', 
      spawningTemp: '26℃',
      eggHatchTime: '2-3天',
      specialRequirements: '需要茂密水草作为产卵床' 
    }
  }
}