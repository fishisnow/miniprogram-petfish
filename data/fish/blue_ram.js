export default {
  id: 'blue_ram',
  card: {
    url: '/images/fish/皇室青魔鬼鱼.jpeg',
    desc: '皇冠青魔鬼鱼',
    info: {
      habitat: '热带鱼，适宜水温26-30℃',
      tips: '对水质敏感，需要稳定的水参数'
    },
    tags: [
      { text: '进阶饲养', theme: 'warning' },
      { text: '对水质敏感', theme: 'danger' },
      { text: '领地性', theme: 'info' }
    ]
  },
  detail: {
    name: '皇冠青魔鬼鱼',
    scientificName: 'Mikrogeophagus ramirezi',
    images: ['/images/fish/blue_ram/1.png', '/images/fish/blue_ram/2.png'],
    description: '皇冠青魔鬼鱼体型优美，色彩艳丽，是南美慈鲷中的明星鱼种。',
    careGuide: {
      waterParameters: {
        temperature: '26-30℃',
        pH: '6.0-7.0',
        hardness: '5-12°dH'
      },
      tankSize: '至少60升/对',
      diet: ['优质慈鲷饲料', '血虫', '丰年虫'],
      commonDiseases: [
        {
          name: '内寄生虫病',
          symptoms: '食欲不振，体色发暗',
          prevention: '定期投药预防，保持水质'
        }
      ]
    },
    breedingInfo: {
      difficulty: '较难',
      spawningTemp: '28-30℃',
      eggHatchTime: '48-60小时'
    }
  }
}; 