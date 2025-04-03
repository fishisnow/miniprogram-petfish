export default {
  id: 'mihuanlanyanden',
  card: {
    url: '/images/fish/迷幻蓝眼灯.jpg',
    desc: '迷幻蓝眼灯',
    info: {
      habitat: '哥伦比亚境内的 Rio San Juan 及其中一支流 Rio Condoto → 水温24-28℃，弱酸性软水', 
      tips: '属珍贵的加拉辛品种 → 建议饲养密度10-15升/条'
    },
    tags: ['进阶', '稀有品种', '环境敏感型']
  },
  detail: {
    name: '迷幻蓝眼灯',
    scientificName: 'Hyphessobrycon condotensis',
    description: [
      '成鱼体长4-5cm，体型修长',
      '鱼体前半身呈土黄色，后半身及鳍翅带淡红彩',
      '眼睛和鳞片泛水蓝色光泽，体色随环境变化明显'
    ],
    careGuide: {
      waterParameters: {
        temperature: '24-28℃',
        pH: '5.5-6.8',
        hardness: '4-8°dH'
      },
      tankSize: '最小40升（适合群养）',
      diet: ['小型活饵', '冷冻血虫', '优质薄片饲料'],
      commonDiseases: [
        {
          name: '白点病',
          symptoms: '体表白点增生、摩擦物体', 
          prevention: '保持水质稳定，新鱼需检疫'
        }
      ]
    },
    breedingInfo: {
      difficulty: '困难', 
      spawningTemp: '26-27℃',
      eggHatchTime: '36-48小时',
      specialRequirements: '需要茂密水草作为产卵介质，弱光环境'
    }
  }
}