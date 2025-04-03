export default {
  id: 'hongbijianchaoyu',
  card: {
    url: '/images/fish/红鼻剪刀鱼.jpg',
    desc: '红鼻剪刀鱼',
    info: {
      habitat: '南美洲亚马逊河流域下游，适宜水温22～26℃，弱酸性软水(pH5.4～6.8)',
      tips: '建议群养不少于3条，需提供躲藏区域'
    },
    tags: ['新手友好', '群游性', '温和']
  },
  detail: {
    name: '红鼻剪刀鱼',
    scientificName: 'Petitella rhodostoma',
    description: [
      '全身银白色半透明体色',
      '头部至吻部呈鲜红色(健康状态下)',
      '尾鳍具5黑4白相间条纹',
      '成体体长50-60mm'
    ],
    careGuide: {
      waterParameters: {
        temperature: '22～26℃',
        pH: '5.4～6.8',
        hardness: '2-8°dH'
      },
      tankSize: '最小40升(适合群养)',
      diet: ['水面小昆虫', '人工薄片饲料', '冷冻血虫'],
      commonDiseases: [
        {
          name: '白点病',
          symptoms: '体表白点增生、摩擦物体',
          prevention: '保持水质稳定，新鱼检疫'
        }
      ]
    },
    breedingInfo: {
      difficulty: '困难',
      spawningTemp: '26℃',
      eggHatchTime: '30小时',
      specialRequirements:
        '需要大型水草缸、极软水(硬度<4°dH)，每次产卵100-200粒'
    }
  }
}