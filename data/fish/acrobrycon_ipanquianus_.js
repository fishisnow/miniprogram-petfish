export default {
  id: 'lanfalaliden',
  card: {
    url: 'http://img.fishisnow.xyz/fish/蓝法拉利灯.jpg',
    desc: '蓝法拉利灯',
    info: {
      habitat: '产自秘鲁乌卡利亚河，喜欢流动且清澈的水质，水温24-28℃，pH 6.0-7.0', 
      tips: '建议饲养密度为每10升水1条，适合群养'
    },
    tags: ['进阶', '温和', '溪流性']
  },
  detail: {
    name: '蓝法拉利灯',
    scientificName: 'Acrobrycon ipanquianus (暂定)',
    description: [
      '成鱼体长5厘米左右，体型修长',
      '全身呈现亮蓝色，晶莹剔透，湛蓝如天空',
      '拥有一片鲜红色的脂鳍作为特征性点缀'
    ],
    careGuide: {
      waterParameters: {
        temperature: '24-28℃',  
        pH: '6.0-7.0',          
        hardness: '4-8°dH'   
      },
      tankSize: '最小40升',      
      diet: ['小型活饵', '冷冻红虫', '优质薄片饲料'],        
      commonDiseases: [     
        {
          name: '褪色症',
          symptoms: '体色变淡或变白', 
          prevention: '保持水质清洁，避免水温过高'
        }
      ]
    },
    breedingInfo: {         
      difficulty: '困难', 
      spawningTemp: '26-28℃',
      eggHatchTime: '2-3天',
      specialRequirements: '需要模拟溪流环境并提供细叶水草作为产卵基质'
    }
  }
}