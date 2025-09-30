export default {
  id: 'hongdian_deng',
  card: {
    url: 'http://img.fishisnow.xyz/fish/红点灯.jpg',
    desc: '红点灯',
    info: {
      habitat: '南美洲热带水域 → 适宜温度24-28℃，弱酸性软水', 
      tips: '建议10条以上群养，每升水饲养1cm鱼体'
    },
    tags: ['进阶', '群游性']
  },
  detail: {
    name: '红点灯',
    scientificName: 'Hemigrammus guyanensis',
    description: [
      '尾柄具有圆形黑斑，上下连接两个红色尾斑',
      '状态优良时尾斑及眼部虹膜呈现鲜明红色光泽',
      '背部前半段有明显隆起形态',
      '属于黑点尾家族中较难辨别的品种'
    ],
    careGuide: {
      waterParameters: {
        temperature: '24-28℃',  
        pH: '5.5-6.8',          
        hardness: '4-8°dH'   
      },
      tankSize: '最小40升',      
      diet: ['小型活饵', '冷冻血虫', '优质薄片饲料'],        
      commonDiseases: [     
        {
          name: '白点病',
          symptoms: '体表白点增生，摩擦物体', 
          prevention: '保持水质稳定，新鱼入缸前检疫'
        }
      ]
    },
    breedingInfo: {         
      difficulty: '困难', 
      spawningTemp: '26℃',
      eggHatchTime: '36-48小时',
      specialRequirements: '需要茂密水草作为产卵床，弱光环境'
    }
  }
}