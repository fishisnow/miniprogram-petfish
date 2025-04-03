export default {
  id: 'ningmengdeng',
  card: {
    url: '/images/fish/柠檬灯鱼.jpg',
    desc: '柠檬灯鱼',
    info: {
      habitat: '微酸性软水，水温23-26℃', 
      tips: '建议每10升水饲养3-5条，需保持群居'
    },
    tags: ['新手友好', '温和', '群游性']
  },
  detail: {
    name: '柠檬灯鱼',
    scientificName: 'Hyphessobrycon pulchripinnis',
    description: [
      '全身呈柠檬黄色，体侧有亮黄色条纹',
      '背鳍透明带柠檬黄边缘及黑色条纹',
      '臀鳍具深黑边缘和黄色前缘条',
      '虹膜呈鲜红色'
    ],
    careGuide: {
      waterParameters: {
        temperature: '23-26℃',
        pH: '5.5-6.5',
        hardness: '4-8°dH'
      },
      tankSize: '最小40升（适合群养）',
      diet: ['小型活饵', '冷冻血虫', '优质薄片饲料'],
      commonDiseases: [
        {
          name: '白点病',
          symptoms: '体表白点增生，摩擦物体', 
          prevention: '保持水质稳定，新鱼检疫'
        }
      ]
    },
    breedingInfo: {
      difficulty: '中等', 
      spawningTemp: '26-28℃',
      eggHatchTime: '24-36小时',
      specialRequirements:'需要茂密水草作为产卵场，弱光环境'
    }
  }
}