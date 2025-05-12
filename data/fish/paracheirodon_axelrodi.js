export default {
  id: 'baoliandeng',
  card: {
    url: 'http://sw5i1glrc.hn-bkt.clouddn.com/fish/宝莲灯鱼.jpg',
    desc: '宝莲灯鱼',
    info: {
      habitat: '南美洲亚马逊河中下游 → 水温22-24℃/偏酸性软水', 
      tips: '宜群养 → 建议10条以上群体饲养'
    },
    tags: ['新手友好', '群游性', '草缸必备']
  },
  detail: {
    name: '宝莲灯鱼',
    scientificName: 'Paracheirodon axelrodi',
    description: [
      '体长4-5厘米的纺锤形小型鱼，头尾较宽吻端圆钝',
      '上半身具荧光蓝绿色带，下半身红色带贯穿全身（区别于红绿灯的半截红）',
      '鳞片具金属反光层，游动时产生闪烁效果'
    ],
    careGuide: {
      waterParameters: {
        temperature: '22-24℃',  
        pH: '5.0-6.5',          
        hardness: '4-8°dH'   
      },
      tankSize: '最小40升（适合群游）',      
      diet: ['水蚤', '线虫', '人工微颗粒饲料'],        
      commonDiseases: [     
        {
          name: '霓虹灯病',
          symptoms: '体色褪色、肌肉白浊', 
          prevention: '保持水质稳定，新鱼入缸前检疫'
        }
      ]
    },
    breedingInfo: {         
      difficulty: '中等', 
      spawningTemp: '26℃',
      eggHatchTime: '36小时',
      specialRequirements: '需密植莫斯水草作为产卵床，极弱光环境'
    }
  }
}