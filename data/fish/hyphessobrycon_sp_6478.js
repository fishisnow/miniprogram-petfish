export default {
  id: 'lanbaodeng',
  card: {
    url: 'http://sw5i1glrc.hn-bkt.clouddn.com/fish/蓝宝灯.jpg',
    desc: '蓝宝灯',
    info: {
      habitat: '南美洲哥伦比亚流域 → 水温24-28℃，弱酸性软水', 
      tips: '建议10升水体饲养5-6条 → 需提供躲避空间减少争斗'
    },
    tags: ['进阶', '领地性强', '稀有品种']
  },
  detail: {
    name: '蓝宝灯',
    scientificName: 'Hyphessobrycon sp.',
    description: [
      '体长约2cm的小型灯鱼',
      '全身布满明亮蓝色虹彩',
      '体侧中央具有蓝绿色金属光泽带',
      '尾柄处可能出现红色斑点（个体差异）'
    ],
    careGuide: {
      waterParameters: {
        temperature: '24-28℃',  
        pH: '5.5-6.8',          
        hardness: '4-8°dH'   
      },
      tankSize: '建议30升以上（群养需更大空间）',      
      diet: ['微型颗粒饲料', '冷冻水蚤', '丰年虾无节幼体'],        
      commonDiseases: [     
        {
          name: '白点病',
          symptoms: '体表白点增生、擦缸行为', 
          prevention: '保持水质稳定，新鱼入缸前检疫'
        }
      ]
    },
    breedingInfo: {         
      difficulty: '困难', 
      spawningTemp: '26-27℃',
      eggHatchTime: '36-48小时',
      specialRequirements:
        '需要极软水（<4°dH）、昏暗环境及莫斯草作为产卵介质'
    }
  }
}