export default {
  id: 'dianguangmeiren',
  card: {
    url: '/images/fish/电光美人.jpg',
    desc: '电光美人',
    info: {
      habitat: '澳洲水域 → 水温22-26℃/硬度10-15°dH/pH6.5-7.5', 
      tips: '建议30升水体饲养5-6条，需保持水流强劲'
    },
    tags: ['新手友好','色彩艳丽','群游性']
  },
  detail: {
    name: '电光美人',
    scientificName: 'Melanotaenia trifasciata',
    description: '1. 纺锤形体型，体长5-6cm；2. 体色淡黄绿色带粉红纵线，鳃盖有红色圆斑；3. 各鳍边缘呈鲜红色，背鳍分前后两段；4. 光线照射时呈现红蓝幻彩效果',
    careGuide: {
      waterParameters: {
        temperature: '22-26℃',  
        pH: '6.5-7.5',          
        hardness: '10-15°dH'   
      },
      tankSize: '最小40升',      
      diet: ['人工薄片','冷冻血虫','水蚤'],        
      commonDiseases: [     
        {
          name: '水霉病',
          symptoms: '体表出现棉絮状菌丝', 
          prevention: '保持水温稳定，定期添加盐浴'
        },
        {
          name: '脊椎弯曲',
          symptoms: '体型异常扭曲',
          prevention: '控制水温不超过28℃，补充钙质'
        }
      ]
    },
    breedingInfo: {         
      difficulty: '中等', 
      spawningTemp: '27-28℃',
      eggHatchTime: '7天',
      specialRequirements:'需硬水环境（可添加海水晶），沉木绑铁皇冠作为产卵床'
    }
  }
}