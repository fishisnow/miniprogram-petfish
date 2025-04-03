export default {
  id: 'chixiadeng',
  card: {
    url: '/images/fish/赤霞灯.jpg',
    desc: '赤霞灯',
    info: {
      habitat: '南美流域 → 水温24-28℃，弱酸性软水(pH 5.5-6.5)', 
      tips: '建议10条以上群养，30升水体起步'
    },
    tags: ['进阶', '稀有品种', '群游性']
  },
  detail: {
    name: '赤霞灯',
    scientificName: 'Hyphessobrycon sp.',
    description: [
      '体长3-4厘米，体表呈现渐变绿至红色光泽',
      '虹膜为亮蓝色，体侧有隐约蓝色荧光侧线（前段渐隐）',
      '尾柄具显著黑色横斑，尾鳍上下叶呈渐变色红彩',
      '腹部呈现蓝绿色荧光，臀鳍周边红色最为浓艳'
    ],
    careGuide: {
      waterParameters: {
        temperature: '24-28℃',  
        pH: '5.5-6.5',          
        hardness: '4-8°dH'   
      },
      tankSize: '30升以上（建议60cm缸体）',      
      diet: ['小型活饵', '冷冻血虫', '优质薄片饲料'],        
      commonDiseases: [     
        {
          name: '白点病',
          symptoms: '体表白点增生、摩擦物体', 
          prevention: '保持水质稳定，新鱼入缸前检疫'
        }
      ]
    },
    breedingInfo: {         
      difficulty: '困难', 
      spawningTemp: '26℃',
      eggHatchTime: '36-48小时',
      specialRequirements: '需密植水草作为产卵床，极软水环境(硬度<4°dH)'
    }
  }
}