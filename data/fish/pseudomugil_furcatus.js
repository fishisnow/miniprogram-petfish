export default {
  id: 'nihongyanzi',
  card: {
    url: 'https://img.fishisnow.xyz/fish/霓虹燕子.jpg',
    desc: '霓虹燕子',
    info: {
      habitat: '新几内亚岛东南部清澈溪流，水温24-27℃，pH7.0-8.0', 
      tips: '建议5-8条群养于40升以上水族箱'
    },
    tags: ['新手友好', '草缸适用', '温和混养']
  },
  detail: {
    name: '霓虹燕子',
    scientificName: 'Pseudomugil furcatus',
    description: [
      '体长6cm的小型彩虹鱼，黄绿色半透明体色',
      '雄鱼具鲜黄色腹部及黑色镶边的背鳍',
      '标志性金属蓝色大眼睛和橙红色胸鳍'
    ],
    careGuide: {
      waterParameters: {
        temperature: '24-27℃',
        pH: '7.0-8.0',
        hardness: '8-12°dH'
      },
      tankSize: '40升以上（建议60cm缸）',
      diet: ['丰年虾', '水蚤', '人工微颗粒饲料'],
      commonDiseases: [
        {
          name: '丝绒病',
          symptoms: '体色暗淡、行动迟缓', 
          prevention: '每周换水30%，保持过滤系统清洁'
        }
      ]
    },
    breedingInfo: {
      difficulty: '中等', 
      spawningTemp: '26-28℃',
      eggHatchTime: '7-10天',
      specialRequirements:
        '需放置尼龙丝产卵拖布，每日收集5-10粒粘性卵'
    }
  }
}