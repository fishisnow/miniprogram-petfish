export default {
  id: 'bolimaoyu',
  card: {
    url: 'http://img.fishisnow.xyz/fish/玻璃猫鱼.jpg',
    desc: '玻璃猫鱼',
    info: {
      habitat: '亚洲的泰国、马来西亚、印度尼西亚 → 水温22-28℃/弱酸性软水', 
      tips: '需群养防止孤独死亡 → 建议10-15条/50L水体'
    },
    tags: ['新手友好','群居性','夜行性']
  },
  detail: {
    name: '玻璃猫鱼',
    scientificName: 'Kryptopterus bicirrhis',
    description: [
      '通体透明可见内脏骨骼，形似柳叶的独特外形',
      '嘴部具两根猫须状长触须用于环境感知',
      '游动时尾部自然下垂，静止时呈40度上倾角',
      '在特定光线下会折射彩虹般光学效果'
    ],
    careGuide: {
      waterParameters: {
        temperature: '22-28℃',  
        pH: '6.3-7.0',          
        hardness: '3-6°dH'   
      },
      tankSize: '至少60cm缸体（适合18cm成体）',
      diet: ['活饵优先（水蚤/线虫）','冷冻血虫','缓沉型人工饲料'],
      commonDiseases: [
        {
          name: '白点病',
          symptoms: '体表白斑、摩擦物体', 
          prevention: '保持水温稳定+新鱼检疫'
        },
        {
          name: '应激反应',
          symptoms:'拒食/体色浑浊',
          prevention:'避免强光+提供躲避水草'
        }
      ]
    },
    breedingInfo: {         
      difficulty: '中等', 
      spawningTemp:'26-28℃',
      eggHatchTime:'48小时',
      specialRequirements:[
        '需模拟雨季环境（每日换1/4软化水）',
        '产卵前需隔离培育（添加维生素E）'
      ]
    }
  }
}