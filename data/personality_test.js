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
    {
      id: 2,
      title: "你愿意花多少时间照顾鱼？",
      options: [
        {
          text: "几乎不管，偶尔喂食",
          score: { buddhist: 2 }
        },
        {
          text: "每天研究水质、调整设备",
          score: { tech: 2 }
        },
        {
          text: "每周换水，保持鱼缸干净漂亮",
          score: { appearance: 1, buddhist: 1 }
        },
        {
          text: "花时间修剪水草、调整造景",
          score: { aquascape: 2 }
        },
        {
          text: "经常逛鱼市，买新鱼",
          score: { diversity: 2 }
        }
      ]
    },
    {
      id: 3,
      title: "你选择鱼的标准是？",
      options: [
        {
          text: "皮实耐活，不容易死",
          score: { buddhist: 2 }
        },
        {
          text: "稀有品种，追求繁殖挑战",
          score: { tech: 2 }
        },
        {
          text: "颜色鲜艳，观赏性强",
          score: { appearance: 2 }
        },
        {
          text: "适合造景，比如灯鱼、虾虎",
          score: { aquascape: 2 }
        },
        {
          text: "什么鱼都想养，混养试试",
          score: { diversity: 2 }
        }
      ]
    },
    {
      id: 4,
      title: "你的鱼缸出现问题时，你会？",
      options: [
        {
          text: "随缘，鱼能扛就扛",
          score: { buddhist: 2 }
        },
        {
          text: "立刻查资料、测水质、买药",
          score: { tech: 2 }
        },
        {
          text: "赶紧换水，不能让鱼缸看起来脏",
          score: { appearance: 1, tech: 1 }
        },
        {
          text: "趁机重新造景，调整布局",
          score: { aquascape: 2 }
        },
        {
          text: "直接买新鱼替换",
          score: { diversity: 1, buddhist: 1 }
        }
      ]
    },
    {
      id: 5,
      title: "你最喜欢的养鱼活动是？",
      options: [
        {
          text: "看鱼游来游去，放松心情",
          score: { buddhist: 2 }
        },
        {
          text: "折腾过滤系统、DIY设备",
          score: { tech: 2 }
        },
        {
          text: "拍照发朋友圈，炫耀漂亮鱼",
          score: { appearance: 2, social: 1 }
        },
        {
          text: "调整水草、石头，打造完美景观",
          score: { aquascape: 2 }
        },
        {
          text: "研究不同鱼的习性，尝试混养",
          score: { diversity: 2 }
        }
      ]
    },
    {
      id: 6,
      title: "你如何看待鱼缸里的藻类？",
      options: [
        {
          text: "无所谓，自然生态",
          score: { buddhist: 2 }
        },
        {
          text: "必须控制，研究除藻方法",
          score: { tech: 2 }
        },
        {
          text: "影响美观，立刻清理",
          score: { appearance: 2 }
        },
        {
          text: "利用藻类做自然造景",
          score: { aquascape: 1, tech: 1 }
        },
        {
          text: "有些鱼吃藻，正好养几条",
          score: { diversity: 1 }
        }
      ]
    },
    {
      id: 7,
      title: "你买鱼的频率是？",
      options: [
        {
          text: "很久才买一次，鱼死了再补",
          score: { buddhist: 2 }
        },
        {
          text: "只买特定品种，追求精品",
          score: { tech: 1, appearance: 1 }
        },
        {
          text: "看到漂亮的就买，不管兼容性",
          score: { appearance: 2 }
        },
        {
          text: "按造景需求选鱼",
          score: { aquascape: 2 }
        },
        {
          text: "经常买新鱼，喜欢尝试不同种类",
          score: { diversity: 2 }
        }
      ]
    },
    {
      id: 8,
      title: "你如何对待鱼缸设备？",
      options: [
        {
          text: "基础过滤就行，越简单越好",
          score: { buddhist: 2 }
        },
        {
          text: "高端设备，CO2、UV杀菌灯全上",
          score: { tech: 2 }
        },
        {
          text: "设备要好看，搭配鱼缸风格",
          score: { appearance: 1, aquascape: 1 }
        },
        {
          text: "按造景需求选择设备",
          score: { aquascape: 2 }
        },
        {
          text: "不同鱼用不同设备，经常换",
          score: { diversity: 1 }
        }
      ]
    },
    {
      id: 9,
      title: "你最喜欢的鱼类视频内容是？",
      options: [
        {
          text: "轻松治愈的鱼缸直播",
          score: { buddhist: 2 }
        },
        {
          text: "技术流养鱼教程",
          score: { tech: 2 }
        },
        {
          text: "漂亮鱼种的展示",
          score: { appearance: 2 }
        },
        {
          text: "造景大赛、水族艺术",
          score: { aquascape: 2 }
        },
        {
          text: "稀有鱼种、混养实验",
          score: { diversity: 2 }
        }
      ]
    },
    {
      id: 10,
      title: "你会如何向朋友推荐养鱼？",
      options: [
        {
          text: "养鱼超简单，不用管！",
          score: { buddhist: 2 }
        },
        {
          text: "你要研究水质、过滤，很有意思！",
          score: { tech: 2 }
        },
        {
          text: "你看我的鱼多漂亮，你也养！",
          score: { appearance: 2, social: 1 }
        },
        {
          text: "造景才是灵魂，鱼只是点缀",
          score: { aquascape: 2 }
        },
        {
          text: "每种鱼都有趣，你都试试！",
          score: { diversity: 2 }
        }
      ]
    }
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