export default {
  id: 'touweideng',
  card: {
    url: 'http://sw5i1glrc.hn-bkt.clouddn.com/fish/头尾灯.jpg',
    desc: '头尾灯',
    info: {
      habitat: '亚马逊河流域 → 23-28℃弱酸性老水', 
      tips: '群居性鱼类 → 建议10条以上群体饲养'
    },
    tags: ['新手友好', '群游性', '温和']
  },
  detail: {
    name: '头尾灯',
    scientificName: 'Hemigrammus ocellifer',
    description: [
      '成鱼体长5厘米，侧扁棒槌形体型',
      '胸部和尾柄处各具黑斑与金黄色斑，游动时如灯光闪烁',
      '体色银灰至棕灰，兴奋时呈现紫红色',
      '尾鳍叉形，背鳍尖形，臀鳍浅黄褐色带银白尖端',
      '虹膜上半部红色，体侧有浅蓝色横向条纹'
    ],
    careGuide: {
      waterParameters: {
        temperature: '23-28℃',  
        pH: '6.0-7.0',          
        hardness: '4-12°dH'   
      },
      tankSize: '最小40升（适合60cm缸）',      
      diet: ['人工颗粒饲料', '冷冻血虫', '丰年虾'],        
      commonDiseases: [     
        {
          name: '白点病',
          symptoms: '体表白点状寄生虫附着', 
          prevention: '保持水温稳定，新鱼入缸前检疫'
        }
      ]
    },
    breedingInfo: {         
      difficulty: '中等', 
      spawningTemp: '26℃',
      eggHatchTime: '24-36小时',
      specialRequirements: '需茂密水草作为产卵床，繁殖期需软水（硬度<6°dH）'
    }
  }
}