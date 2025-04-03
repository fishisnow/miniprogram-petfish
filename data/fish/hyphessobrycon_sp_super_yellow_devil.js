export default {
  id: 'super_yellow_devil_tetra',
  card: {
    url: '/images/fish/超级黄魔鬼灯.jpg',
    desc: '超级黄魔鬼灯',
    info: {
      habitat: '野生采集自柏拉省 (Rio Guama, Para State)，与蓝蒂灯同流域 → 适宜温度24-28℃，弱酸性软水', 
      tips: '性格凶悍好动 → 建议每10升水饲养1条，需提供躲藏空间'
    },
    tags: ['进阶', '凶悍', '活跃']
  },
  detail: {
    name: '超级黄魔鬼灯',
    scientificName: 'Hyphessobrycon sp. Super Yellow Devil',
    description: [
      '体侧具有明显黑线，下方带紫色金属光泽亮点',
      '成体呈现淡黄色体色与鳍翅着色',
      '青蓝色眼部虹膜特征明显',
      '存在红型与黄型两种色系变种'
    ],
    careGuide: {
      waterParameters: {
        temperature: '24-28℃',  
        pH: '5.5-6.8',          
        hardness: '4-8°dH'   
      },
      tankSize: '最小40升（单品种群养需60升以上）',
      diet: ['活饵（红虫/水蚤）', '冷冻饲料', '高品质人工颗粒'],
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
      specialRequirements: '需密植水草作为产卵床，弱光环境'
    }
  }
}