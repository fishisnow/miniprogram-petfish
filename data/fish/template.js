// 这个文件作为参考模板，不需要导出
const template = {
  id: '', // 唯一标识
  card: {
    url: '', // 图片路径
    desc: '', // 鱼类名称
    info: {
      habitat: '', // 栖息环境
      tips: ''  // 养护提示
    },
    tags: [] // 标签数组
  },
  detail: {
    name: '', // 中文名
    scientificName: '', // 学名
    images: [], // 详情图片数组
    description: '', // 详细描述
    careGuide: {
      waterParameters: {
        temperature: '', // 适宜温度
        pH: '', // pH值
        hardness: '' // 水硬度
      },
      tankSize: '', // 建议鱼缸大小
      diet: [], // 食物清单
      commonDiseases: [] // 常见疾病
    },
    breedingInfo: {
      difficulty: '', // 繁殖难度
      spawningTemp: '', // 产卵温度
      eggHatchTime: '' // 孵化时间
    }
  }
}; 