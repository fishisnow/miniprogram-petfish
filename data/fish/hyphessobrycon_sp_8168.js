export default {
  id: 'banbaijin',
  card: {
    url: '/images/fish/半白金灯.jpg',
    desc: '半白金灯',
    info: {
      habitat: '南美流域 → 温度24-28℃/弱酸性软水', 
      tips: '建议5-10条群养，60cm以上缸体'
    },
    tags: ['进阶', '稀有品种', '观赏性强']
  },
  detail: {
    name: '半白金灯',
    scientificName: 'Hyphessobrycon sp.',
    description: [
      '体表呈现半白金色泽，带有金属质感',
      '鱼体表面覆盖薄金粉状反光层',
      '体侧具青蓝色荧光侧线'
    ],
    careGuide: {
      waterParameters: {
        temperature: '24-28℃',  
        pH: '5.5-6.8',          
        hardness: '4-8°dH'   
      },
      tankSize: '60升以上',
      diet: ['小型活饵', '薄片饲料', '冷冻红虫'],
      commonDiseases: [
        {
          name: '白点病',
          symptoms: '体表白点增生、擦缸行为', 
          prevention: '保持水温稳定，新鱼入缸前检疫'
        }
      ]
    },
    breedingInfo: {         
      difficulty: '困难', 
      spawningTemp: '26℃',
      eggHatchTime: '36-48小时',
      specialRequirements: '需茂密水草作为产卵床，极软水环境（硬度<4°dH）'
    }
  }
}