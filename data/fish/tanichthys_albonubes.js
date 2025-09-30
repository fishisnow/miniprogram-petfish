export default {
  id: 'baiyunjinsi',
  card: {
    url: 'http://img.fishisnow.xyz/fish/白云金丝鱼.jpg',
    desc: '白云金丝鱼',
    info: {
      habitat: '山间清澈溪流→ 水温5-25℃，pH6.0-7.5', 
      tips: '建议每10升水饲养3-5条'
    },
    tags: ['新手友好', '草缸适用', '耐低温']
  },
  detail: {
    name: '白云金丝鱼',
    scientificName: 'Tanichthys albonubes',
    description: [
      '体长4cm左右，长而侧扁的纤细体型',
      '体侧具金黄色或银蓝色纵向荧光带',
      '尾柄红色圆斑与透明边缘的黄绿色鳍'
    ],
    careGuide: {
      waterParameters: {
        temperature: '18-25℃',  
        pH: '6.0-7.5',          
        hardness: '6-8°dH'   
      },
      tankSize: '30升以上',      
      diet: ['人工饲料','丰年虾','菜叶','麦片'],        
      commonDiseases: [     
        {
          name: '白点病',
          symptoms: '体表白点状寄生虫', 
          prevention: '保持水质稳定，新鱼入缸前检疫'
        }
      ]
    },
    breedingInfo: {         
      difficulty: '容易', 
      spawningTemp: '22-26℃',
      eggHatchTime: '2-3天',
      specialRequirements: '需水草作为产卵基质'
    }
  }
}