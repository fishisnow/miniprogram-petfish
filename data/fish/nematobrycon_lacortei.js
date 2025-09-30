export default {
  id: 'caihongdiwangdeng',
  card: {
    url: 'http://img.fishisnow.xyz/fish/彩虹帝王灯.jpg',
    desc: '彩虹帝王灯',
    info: {
      habitat: '哥伦比亚西部流域 → 温度24-28℃/弱酸性软水', 
      tips: '对水质敏感 → 建议每10升水饲养1条'
    },
    tags: ['进阶', '敏感水质', '两性异形']
  },
  detail: {
    name: '彩虹帝王灯',
    scientificName: 'Nematobrycon lacortei',
    description: [
      '成鱼体长5厘米，全身可呈现七彩金属光泽',
      '雄性尾鳍中央鳍条延长呈丝状，虹膜红色',
      '雌性虹膜蓝色，尾鳍无延长特征'
    ],
    careGuide: {
      waterParameters: {
        temperature: '24-28℃',  
        pH: '5.5-6.8',          
        hardness: '4-8°dH'   
      },
      tankSize: '最小40升',      
      diet: ['人工薄片饲料', '冷冻血虫(需消毒)'],        
      commonDiseases: [     
        {
          name: '细菌性腹水病',
          symptoms: '腹部肿胀、鳞片竖立', 
          prevention: '保持硝酸盐<20ppm，每周换水30%'
        }
      ]
    },
    breedingInfo: {         
      difficulty: '中等', 
      spawningTemp: '26℃',
      eggHatchTime: '36-48小时',
      specialRequirements: '需密植水草作为产卵床，繁殖期需提高活饵比例'
    }
  }
}