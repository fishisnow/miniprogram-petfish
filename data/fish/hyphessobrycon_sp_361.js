export default {
  id: 'tianshenheideng',
  card: {
    url: '/images/fish/天神黑灯.jpg',
    desc: '天神黑灯',
    info: {
      habitat: '申古河上游 Rio Iriri → 温度24-28℃/弱酸性软水', 
      tips: '建议饲养密度5-8条/30L水体'
    },
    tags: ['进阶', '稀有品种', '群游性']
  },
  detail: {
    name: '天神黑灯',
    scientificName: 'Hyphessobrycon sp.',
    description: [
      '基色为土黄色体表',
      '具有青黄色侧线荧光带',
      '腹部至臀鳍区域呈黑色素沉积',
      '尾柄处有独特金黄色斑点'
    ],
    careGuide: {
      waterParameters: {
        temperature: '24-28℃',
        pH: '5.5-6.8',
        hardness: '4-8°dH'
      },
      tankSize: '最小40L水体（适合6-10条群养）',
      diet: ['微型颗粒饲料', '冷冻红虫', '水蚤'],
      commonDiseases: [
        {
          name: '白点病',
          symptoms: '体表白点增生、擦缸行为', 
          prevention: '保持水质稳定，新鱼需检疫'
        }
      ]
    },
    breedingInfo: {
      difficulty: '困难', 
      spawningTemp: '26℃',
      eggHatchTime: '36-48小时',
      specialRequirements: '需要茂密水草作为产卵床，极软水环境（TDS<50）'
    }
  }
}