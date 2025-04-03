export default {
  id: 'yinpingdeng',
  card: {
    url: '/images/fish/银屏灯.jpg',
    desc: '银屏灯',
    info: {
      habitat: '南美洲亚马逊河、圭亚那等地 → 水温22-25℃/pH5.8-6.8/软水', 
      tips: '建议单独饲养 → 最小30L水体/每5cm鱼体需2L空间'
    },
    tags: ['进阶', '半凶猛性', '中层活动', '水草需求']
  },
  detail: {
    name: '银屏灯',
    scientificName: 'Moenkhausia sanctaefilomenae',
    description: [
      '纺锤形体型，体长5-7cm，通体银灰色鳞片边缘带黑色镶边',
      '眼部特征显著：眼上部具鲜红色斑，虹膜有红色反光点',
      '尾鳍基部有醒目的黑色宽横带纹'
    ],
    careGuide: {
      waterParameters: {
        temperature: '20-25℃（耐受下限15℃）',
        pH: '5.8-6.8（弱酸性）',
        hardness: '4-8°dH（软水）'
      },
      tankSize: '最小30升（建议60升以上）',
      diet: ['活饵（红虫/水蚤）', '冷冻血虫', '高品质薄片饲料'],
      commonDiseases: [
        {
          name: '白点病',
          symptoms: '体表白点、摩擦底砂', 
          prevention: '保持水温稳定+新鱼检疫'
        },
        {
          name: '霓虹灯病',
          symptoms: '肌肉坏死、体色褪失',
          prevention: '避免混养感染源'
        }
      ]
    },
    breedingInfo: {
      difficulty: '困难', 
      spawningTemp: '26-28℃',
      eggHatchTime: '48小时',
      specialRequirements:
        '需极软蒸馏水(pH5.6-6.5)+金丝草产卵床+黑暗环境'
    }
  }
}