export default {
  id: 'shuilingdeng',
  card: {
    url: '/images/fish/水灵灯.jpg',
    desc: '水灵灯',
    info: {
      habitat: '产自申古河支流Rio iriri，栖息在水流湍急的河段 → 适宜温度24-28℃，弱酸性软水', 
      tips: '成鱼体长8公分 → 建议60升以上水体，单养或小群饲养（6-8只）'
    },
    tags: ['进阶', '半攻击性', '艳丽体色']
  },
  detail: {
    name: '水灵灯',
    scientificName: 'Moenkhausia heikoi',
    description: [
      '体色以黑色为主基调，体侧具闪烁水蓝色亮线及鳞片反光',
      '胸鳍和腹鳍呈现浓厚黄色，腹臀鳍边缘有乳白色裙摆状延伸',
      '眼部黝黑配合黄橙色上虹膜，成鱼体长可达8公分'
    ],
    careGuide: {
      waterParameters: {
        temperature: '24-28℃',  
        pH: '5.5-6.8',          
        hardness: '4-8°dH'   
      },
      tankSize: '建议60升以上（单养）或100升（群养）',
      diet: ['小型活饵', '冷冻血虫', '优质薄片饲料'],
      commonDiseases: [
        {
          name: '白点病',
          symptoms: '体表白点增生、摩擦物体', 
          prevention: '保持水温稳定，新鱼入缸前检疫'
        }
      ]
    },
    breedingInfo: {
      difficulty: '中等', 
      spawningTemp: '26-28℃',
      eggHatchTime: '36-48小时',
      specialRequirements:'需要密集水草作为产卵床，弱光环境'
    }
  }
}