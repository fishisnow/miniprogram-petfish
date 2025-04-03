export default {
  id: 'landideng',
  card: {
    url: '/images/fish/蓝帝灯.jpg',
    desc: '蓝帝灯',
    info: {
      habitat: '巴西塔巴赫斯上游支流茹鲁埃纳河（Rio Juruena）→ 温度24-28℃，弱酸性软水', 
      tips: '个性温和，活泼好动→ 建议每10升水饲养3-4条'
    },
    tags: ['新手友好', '群游性']
  },
  detail: {
    name: '蓝帝灯',
    scientificName: 'Hyphessobrycon cyanotaenia',
    description: [
      '成鱼体长4厘米左右，体型粗厚',
      '体色为灰色或淡黄色，体侧有宽阔黑色纵带（黑间）',
      '黑间上下鳞片具蓝色金属光泽，游动时闪烁明显',
      '存在不太明显的垂直肩斑，不同产地个体表现略有差异'
    ],
    careGuide: {
      waterParameters: {
        temperature: '24-28℃',  
        pH: '5.5-7.0',          
        hardness: '4-8°dH'   
      },
      tankSize: '最小30升（适合小群饲养）',
      diet: [
        '人工薄片/颗粒饲料', 
        '冷冻血虫/丰年虾（需控制喂食量）'
      ],
      commonDiseases: [
        {
          name: '细菌性肠炎',
          symptoms: '腹部肿胀、食欲减退', 
          prevention: '避免过量投喂活饵，定期换水保持水质'
        }
      ]
    },
    breedingInfo: {         
      difficulty: '中等', 
      spawningTemp: '26-28℃',
      eggHatchTime: '36-48小时',
      specialRequirements: '需密植水草作为产卵介质，弱光环境更易成功'
    }
  }
}