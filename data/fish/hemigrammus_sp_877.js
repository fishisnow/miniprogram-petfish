export default {
  id: 'banhongyidianhong',
  card: {
    url: '/images/fish/半红型一点红.jpg',
    desc: '半红型一点红',
    info: {
      habitat: '哥伦比亚奥利诺科支流Rio Mesetas及委内瑞拉Capanaparo River National Park范围内的Caño La Pica → 水温24-28℃，弱酸性软水', 
      tips: '体长2.5-3.5cm → 建议饲养密度10-15尾/30L'
    },
    tags: ['进阶', '稀有品种']
  },
  detail: {
    name: '半红型一点红',
    scientificName: 'Hemigrammus sp.',
    description: [
      '体长仅2.5-3.5cm的微型加拉辛',
      '身体前半部呈现翠绿色金属光泽',
      '后半部红色延伸至背鳍中部以下位置',
      '红色区域约占身体总长度的50%'
    ],
    careGuide: {
      waterParameters: {
        temperature: '24-28℃',  
        pH: '5.5-6.8',          
        hardness: '4-8°dH'   
      },
      tankSize: '最小30L',      
      diet: ['微型颗粒饲料', '冷冻卤虫无节幼体', '水蚤'],        
      commonDiseases: [     
        {
          name: '白点病',
          symptoms: '体表白点增生，摩擦物体', 
          prevention: '保持水质稳定，新鱼入缸前检疫'
        }
      ]
    },
    breedingInfo: {         
      difficulty: '困难', 
      spawningTemp: '26-28℃',
      eggHatchTime: '36-48小时',
      specialRequirements: '需要茂密的水草作为产卵基质，极软水(硬度<4°dH)环境'
    }
  }
}