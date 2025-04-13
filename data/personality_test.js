const personalityTest = {
  questions: [
    {
      id: 1,
      title: "你理想的鱼缸是什么样的？",
      options: [
        {
          text: "随便一个小缸，鱼活着就行",
          score: { buddhist: 2 }
        },
        {
          text: "高科技设备齐全，自动喂食+智能控温",
          score: { tech: 2 }
        },
        {
          text: "色彩斑斓的鱼群，像海底世界",
          score: { appearance: 2 }
        },
        {
          text: "复杂造景，沉木、水草、石头精心布置",
          score: { aquascape: 2 }
        },
        {
          text: "养很多不同品种，每种都试试",
          score: { diversity: 2 }
        }
      ]
    },
    // ... 其他9道题目的数据结构相同
  ],
  dimensions: [
    {
      id: "buddhist",
      name: "佛系",
      maxScore: 20
    },
    {
      id: "tech",
      name: "技术控",
      maxScore: 20
    },
    {
      id: "appearance",
      name: "颜值控",
      maxScore: 20
    },
    {
      id: "aquascape",
      name: "造景控",
      maxScore: 20
    },
    {
      id: "diversity",
      name: "品种多样化",
      maxScore: 20
    },
    {
      id: "social",
      name: "社交分享",
      maxScore: 10
    }
  ],
  recommendations: {
    buddhist: {
      title: "佛系养鱼达人",
      fishes: ["孔雀鱼", "斑马鱼", "月光鱼"],
      description: "适合养一些皮实耐活的鱼种，无需太多维护也能活得很好！"
    },
    tech: {
      title: "技术流大师",
      fishes: ["七彩神仙鱼", "龙鱼", "地图鱼"],
      description: "建议尝试一些需要精细照顾的鱼种，发挥你的专业技术！"
    },
    appearance: {
      title: "颜值至上派",
      fishes: ["斗鱼", "灯科鱼", "孔雀鱼"],
      description: "这些色彩艳丽的鱼种最适合你，让鱼缸成为一道亮丽的风景！"
    },
    aquascape: {
      title: "造景艺术家",
      fishes: ["水晶虾", "短鲷", "红鼻剪刀鱼"],
      description: "这些鱼种最适合搭配精美的水草造景，打造完美水世界！"
    },
    diversity: {
      title: "百鱼园主",
      fishes: ["小型热带鱼混养", "孔雀鱼群", "小型灯鱼群"],
      description: "可以尝试各种小型鱼的混养组合，体验不同鱼种的乐趣！"
    }
  }
};

export default personalityTest; 