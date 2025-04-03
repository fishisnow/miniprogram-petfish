export default {
  id: 'minishuijingdeng',
  card: {
    url: '/images/fish/迷你水晶灯.jpg',
    desc: '迷你水晶灯',
    info: {
      habitat: '南美流域 → 水温24-28℃/弱酸性软水', 
      tips: '建议5-10只群养/30L水体'
    },
    tags: ['进阶', '透明体色', '小型群游']
  },
  detail: {
    name: '迷你水晶灯',
    scientificName: 'Moenkhausia sp.',
    description: [
      '通体透明无色素沉积，内脏清晰可见',
      '背鳍无扯鳍类常见斑纹特征',
      '体侧缺乏典型亮线结构',
      '体型类似米诺水晶旗但更娇小'
    ],
    careGuide: {
      waterParameters: {
        temperature: '24-28℃',  
        pH: '5.5-6.8',          
        hardness: '2-8°dH'   
      },
      tankSize: '30L以上',      
      diet: ['微颗粒饲料', '冷冻水蚤', '丰年虾无节幼体'],
      commonDiseases: [
        {
          name: '霓虹灯病',
          symptoms: '体表出现乳白色斑块', 
          prevention: '保持水质稳定，避免突然的温度波动'
        }
      ]
    },
    breedingInfo: {         
      difficulty: '困难', 
      spawningTemp: '26℃',
      eggHatchTime: '36-48小时',
      specialRequirements: '需密植水草作为产卵介质，极软水环境(＜4°dH)'
    }
  }
}