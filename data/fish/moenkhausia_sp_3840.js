export default {
  id: 'hongyiheidiankekadeng',
  card: {
    url: '/images/fish/红翼黑点可卡灯.jpg',
    desc: '红翼黑点可卡灯',
    info: {
      habitat: '南美亚马逊流域 → 水温24-28℃，弱酸性软水', 
      tips: '建议10条以上群养，每10升水饲养1条'
    },
    tags: ['进阶', '群游性']
  },
  detail: {
    name: '红翼黑点可卡灯',
    scientificName: 'Moenkhausia sp.',
    description: [
      '幼鱼与蓝眼闪鳞可卡灯极为相似，成鱼后差异明显',
      '背部闪烁红色光泽，各鳍末端泛红（"红翼"特征）',
      '虹膜仅下半部呈蓝色，尾柄有大黑斑带黄色光晕'
    ],
    careGuide: {
      waterParameters: {
        temperature: '24-28℃',  
        pH: '5.5-7.0',          
        hardness: '4-8°dH'   
      },
      tankSize: '60升以上',      
      diet: ['人工薄片饲料', '冷冻血虫', '枝角类'],        
      commonDiseases: [     
        {
          name: '白点病',
          symptoms: '体表白点增生、摩擦物体', 
          prevention: '保持水质稳定，新鱼入缸前检疫'
        }
      ]
    },
    breedingInfo: {         
      difficulty: '中等', 
      spawningTemp: '26℃',
      eggHatchTime: '2-3天',
      specialRequirements: '需密植水草作为产卵床，弱光环境'
    }
  }
}