export default {
  id: 'sanseqi',
  card: {
    url: '/images/fish/三色旗.jpg',
    desc: '三色旗',
    info: {
      habitat: '巴西东部的瓜玛流域（Rio Guamá）→ 温度24-28℃，弱酸性软水', 
      tips: '体型3cm → 建议30升水体饲养10-15条'
    },
    tags: ['新手友好', '群游性', '夸示行为']
  },
  detail: {
    name: '三色旗',
    scientificName: 'Hyphessobrycon sp.',
    description: [
      '背鳍呈独特的白黑红三色条纹',
      '基色为淡金黄色，发情时后半身及各鳍红色素增强',
      '臀鳍带明显黑边无白色，胸斑处有金色反光区'
    ],
    careGuide: {
      waterParameters: {
        temperature: '24-28℃',
        pH: '5.5-7.0',
        hardness: '4-8°dH'
      },
      tankSize: '最小30升（适合60cm缸）',
      diet: ['小型颗粒饲料', '冷冻红虫', '丰年虾'],
      commonDiseases: [
        {
          name: '白点病',
          symptoms: '体表白点增生、摩擦物体', 
          prevention: '保持水温稳定，新鱼检疫'
        }
      ]
    },
    breedingInfo: {
      difficulty: '中等', 
      spawningTemp: '26-28℃',
      eggHatchTime: '36-48小时',
      specialRequirements: '需要茂密水草作为产卵床，弱光环境'
    }
  }
}