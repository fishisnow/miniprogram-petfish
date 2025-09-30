export default {
  id: 'zebra_danio',
  card: {
    url: 'http://img.fishisnow.xyz/fish/斑马鱼.jpeg',
    desc: '斑马鱼',
    info: {
      habitat: '冷水鱼，适宜水温18-24℃',
      tips: '活泼好动，需要足够的游动空间'
    },
    tags: ['新手友好', '群养', '耐寒'],
  },
  detail: {
    name: '斑马鱼',
    scientificName: 'Danio rerio',
    images: ['/images/fish/zebra_danio/1.png', '/images/fish/zebra_danio/2.png'],
    description: '斑马鱼体侧有明显的黑白条纹，游动敏捷，适应能力强。',
    careGuide: {
      waterParameters: {
        temperature: '18-24℃',
        pH: '6.5-7.5',
        hardness: '5-15°dH'
      },
      tankSize: '至少40升/群',
      diet: ['鱼片', '水蚤', '蚊子幼虫'],
      commonDiseases: [
        {
          name: '鱼鳃病',
          symptoms: '鱼鳃发红，呼吸困难',
          prevention: '保持水质清洁，避免突然温度变化'
        }
      ]
    },
    breedingInfo: {
      difficulty: '容易',
      spawningTemp: '20-23℃',
      eggHatchTime: '48-72小时'
    }
  }
}; 