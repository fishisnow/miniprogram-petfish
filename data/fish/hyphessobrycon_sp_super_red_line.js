export default {
  id: 'hongxiudeng',
  card: {
    url: '/images/fish/红袖灯.jpg',
    desc: '红袖灯',
    info: {
      habitat: '秘鲁泰加流域 → 水温24-28℃，弱酸性软水', 
      tips: '饲养密度建议每10升水配1条成鱼'
    },
    tags: ['进阶', '稀有品种', '红线特征']
  },
  detail: {
    name: '红袖灯',
    scientificName: 'Hyphessobrycon sp. super red line',
    description: '体侧具鲜艳红色纵带，腹部呈现梅塔家族特有的暗色斑块，成体尺寸约3-4cm，白金个体为罕见变异型',
    careGuide: {
      waterParameters: {
        temperature: '24-28℃',  
        pH: '5.5-6.8',          
        hardness: '4-8°dH'   
      },
      tankSize: '最小40升（适合群养）',      
      diet: ['小型活饵', '薄片饲料', '冷冻血虫'],        
      commonDiseases: [     
        {
          name: '高温应激症',
          symptoms: '呼吸急促/褪色', 
          prevention: '夏季需加强降温措施，保持水温不超过30℃'
        }
      ]
    },
    breedingInfo: {         
      difficulty: '中等', 
      spawningTemp: '26℃',
      eggHatchTime: '36-48小时',
      specialRequirements: '需密植水草作为产卵介质，弱光环境'
    }
  }
}