export default {
  id: 'mickey_mouse_platy',
  card: {
    url: 'https://img.fishisnow.xyz/fish/米奇鱼.jpeg',
    desc: '米奇鱼',
    info: {
      habitat: '热带鱼，适宜水温20-26℃',
      tips: '性情温和，适合新手入门'
    },
    tags: ['新手友好', '群养', '胎生鱼'],
  },
  detail: {
    name: '米奇鱼',
    scientificName: 'Xiphophorus maculatus',
    images: ['/images/fish/mickey_platy/1.png', '/images/fish/mickey_platy/2.png'],
    description: '米奇鱼尾部有类似米老鼠图案的斑点，性格活泼，容易繁殖。',
    careGuide: {
      waterParameters: {
        temperature: '20-26℃',
        pH: '7.0-8.0',
        hardness: '10-20°dH'
      },
      tankSize: '至少30升/群',
      diet: ['鱼片', '小型活饵', '藻类'],
      commonDiseases: [
        {
          name: '腹水病',
          symptoms: '腹部膨大，鳞片竖起',
          prevention: '避免过度投喂，保持水质'
        }
      ]
    },
    breedingInfo: {
      difficulty: '容易',
      spawningTemp: '24-26℃',
      eggHatchTime: '胎生鱼类，孕期约28天'
    }
  }
}; 