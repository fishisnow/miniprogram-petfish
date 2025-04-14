const personalityTestData = require('../../data/personality_test');

Component({
  data: {
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswers: [],
    showResult: false,
    testResult: null,
    dimensions: [],
    recommendations: {},
    radarDimensionNames: [], // 雷达图维度名称
    radarScores: [], // 雷达图各维度得分
    radarImage: null // 雷达图生成的图片路径
  },

  lifetimes: {
    attached() {
      console.log('组件初始化');
      // 组件初始化时加载数据
      if (personalityTestData && personalityTestData.default) {
        console.log('加载测试数据', personalityTestData.default);
        this.setData({
          questions: personalityTestData.default.questions,
          dimensions: personalityTestData.default.dimensions,
          recommendations: personalityTestData.default.recommendations
        });
      } else if (personalityTestData) {
        console.log('加载测试数据(无default)', personalityTestData);
        this.setData({
          questions: personalityTestData.questions,
          dimensions: personalityTestData.dimensions,
          recommendations: personalityTestData.recommendations
        });
      } else {
        console.error('未找到测试数据');
      }
    },
    
    ready() {
      console.log('组件准备完成');
      console.log('问题数量:', this.data.questions.length);
      console.log('当前问题:', this.data.currentQuestionIndex);
    }
  },

  methods: {
    handleOptionSelect(e) {
      const { option, questionIndex, optionIndex } = e.currentTarget.dataset;
      const { selectedAnswers, currentQuestionIndex, questions } = this.data;
      
      // 更新选中状态
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[questionIndex] = optionIndex;
      
      this.setData({
        selectedAnswers: newSelectedAnswers
      });

      // 如果是最后一题，计算结果
      if (questionIndex === questions.length - 1) {
        this.calculateResult();
      } else {
        // 延迟滑动到下一题，让用户看到选中效果
        setTimeout(() => {
          this.setData({
            currentQuestionIndex: currentQuestionIndex + 1
          });
        }, 300);
      }
    },

    handleSwiperChange(e) {
      this.setData({
        currentQuestionIndex: e.detail.current
      });
    },

    handleBack() {
      console.log('返回按钮点击');
      // 如果正在测试中，弹出确认对话框
      if (!this.data.showResult) {
        wx.showModal({
          title: '',
          content: '确定要退出测试吗？当前进度将不会保存。',
          success: (res) => {
            if (res.confirm) {
              wx.navigateBack();
            }
          }
        });
      } else {
        // 如果已经完成测试，直接返回
        wx.navigateBack();
      }
    },

    calculateResult() {
      const { selectedAnswers, questions } = this.data;
      const scores = {};
      
      // 初始化分数
      this.data.dimensions.forEach(dim => {
        scores[dim.id] = 0;
      });

      // 计算每个维度的分数
      selectedAnswers.forEach((answerIndex, questionIndex) => {
        const option = questions[questionIndex].options[answerIndex];
        Object.entries(option.score).forEach(([dimension, score]) => {
          scores[dimension] = (scores[dimension] || 0) + score;
        });
      });

      // 找出得分最高的维度
      let maxScore = -1;
      let maxDimension = null;
      Object.entries(scores).forEach(([dimension, score]) => {
        if (score > maxScore) {
          maxScore = score;
          maxDimension = dimension;
        }
      });

      // 获取对应的推荐结果
      const result = this.data.recommendations[maxDimension];

      // 准备雷达图数据
      const radarData = [];
      const dimensionNames = [];
      
      this.data.dimensions.forEach(dim => {
        dimensionNames.push(dim.name);
        radarData.push(scores[dim.id]);
      });

      this.setData({
        showResult: true,
        testResult: result,
        radarDimensionNames: dimensionNames,
        radarScores: radarData
      });

      // 触发测试完成事件
      this.triggerEvent('testComplete', { result, scores });
      
      // 绘制雷达图
      setTimeout(() => {
        this.drawRadarChart();
      }, 300);
    },

    restartTest() {
      this.setData({
        currentQuestionIndex: 0,
        selectedAnswers: [],
        showResult: false,
        testResult: null
      });
    },

    drawRadarChart() {
      const { radarScores, radarDimensionNames } = this.data;
      if (!radarScores || !radarDimensionNames || radarScores.length === 0) {
        console.error('雷达图数据不完整');
        return;
      }
      
      // 创建canvas上下文
      const ctx = wx.createCanvasContext('radarCanvas', this);
      
      // 设置画布基本参数 - 提高清晰度，使用更高的像素比
      const devicePixelRatio = wx.getSystemInfoSync().pixelRatio || 2;
      const width = 250;  // 减小画布宽度
      const height = 250; // 减小画布高度
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) * 0.65; // 雷达图半径
      
      // 计算维度数量和角度
      const dimensionCount = radarDimensionNames.length;
      const angleStep = Math.PI * 2 / dimensionCount;
      
      // 设置最大分值（这里假设所有维度的最大值都是20）
      const maxScore = 20;
      
      // 吉卜力风格配色 - 为不同维度设置不同颜色
      const ghibliColors = {
        bg: '#f2f7f4',             // 背景色
        gridLine: '#d3e0d8',       // 网格线
        axisLine: '#a5c6b1',       // 坐标轴线
        labelText: '#5d6b75',      // 标签文字
        dimensions: {
          buddhist: {              // 佛系
            color: '#7aab98',      // 龙猫绿
            name: '佛系'
          },
          tech: {                  // 技术控
            color: '#5388a0',      // 千与千寻蓝
            name: '技术控'
          },
          appearance: {            // 颜值控
            color: '#e9879b',      // 哈尔的红色
            name: '颜值控'
          },
          aquascape: {             // 造景控
            color: '#a4b556',      // 天空之城绿
            name: '造景控'
          },
          diversity: {             // 品种多样化
            color: '#f8b650',      // 崖上的金黄
            name: '多样化'
          },
          social: {                // 社交分享
            color: '#a78fc2',      // 魔女宅急便紫
            name: '社交型'
          }
        }
      };
      
      // 绘制背景
      ctx.setFillStyle(ghibliColors.bg);
      ctx.fillRect(0, 0, width, height);
      
      // 绘制雷达图背景多边形
      for (let level = 1; level <= 5; level++) { // 绘制5个层级
        const levelRadius = radius * (level / 5);
        ctx.beginPath();
        
        for (let i = 0; i < dimensionCount; i++) {
          const angle = i * angleStep - Math.PI / 2; // 从顶部开始
          const x = centerX + levelRadius * Math.cos(angle);
          const y = centerY + levelRadius * Math.sin(angle);
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.closePath();
        ctx.setStrokeStyle(ghibliColors.gridLine);
        ctx.setLineWidth(1);
        ctx.stroke();
      }
      
      // 绘制从中心到各顶点的连线
      for (let i = 0; i < dimensionCount; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.setStrokeStyle(ghibliColors.axisLine);
        ctx.setLineWidth(1);
        ctx.stroke();
      }
      
      // 获取维度ID数组
      const dimensionIds = this.data.dimensions.map(dim => dim.id);
      
      // 绘制数据多边形
      ctx.beginPath();
      for (let i = 0; i < dimensionCount; i++) {
        const score = radarScores[i];
        const scoreRatio = score / maxScore;
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + radius * scoreRatio * Math.cos(angle);
        const y = centerY + radius * scoreRatio * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      
      // 填充数据多边形 - 修复透明度问题
      ctx.setFillStyle('rgba(122, 171, 152, 0.5)'); // 使用rgba格式代替hex+透明度
      ctx.fill();
      
      // 绘制数据多边形边框
      ctx.setStrokeStyle('#5d6b75');
      ctx.setLineWidth(2);
      ctx.stroke();
      
      // 绘制各维度的名称
      ctx.setFontSize(11); // 略微减小字体
      ctx.setTextAlign('center');
      ctx.setTextBaseline('middle');
      
      for (let i = 0; i < dimensionCount; i++) {
        const angle = i * angleStep - Math.PI / 2;
        // 标签位置略微超出图表边缘
        const labelRadius = radius * 1.15;
        const x = centerX + labelRadius * Math.cos(angle);
        const y = centerY + labelRadius * Math.sin(angle);
        
        const dimensionId = dimensionIds[i];
        const dimensionColor = ghibliColors.dimensions[dimensionId]?.color || ghibliColors.labelText;
        
        ctx.setFillStyle(dimensionColor);
        ctx.fillText(radarDimensionNames[i], x, y);
      }
      
      // 绘制各维度的数据点和得分线
      for (let i = 0; i < dimensionCount; i++) {
        const score = radarScores[i];
        const scoreRatio = score / maxScore;
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + radius * scoreRatio * Math.cos(angle);
        const y = centerY + radius * scoreRatio * Math.sin(angle);
        
        const dimensionId = dimensionIds[i];
        const dimensionColor = ghibliColors.dimensions[dimensionId]?.color || '#7aab98';
        
        // 绘制从中心到数据点的线条
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.setStrokeStyle(dimensionColor);
        ctx.setLineWidth(1.5);
        ctx.stroke();
        
        // 绘制数据点
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.setFillStyle(dimensionColor);
        ctx.fill();
        ctx.setStrokeStyle('#ffffff');
        ctx.setLineWidth(1.5);
        ctx.stroke();
      }
      
      // 完成绘制
      ctx.draw(false, () => {
        // 绘制完成后，将canvas转为图片
        setTimeout(() => {
          this.canvasToImage();
        }, 200);
      });
    },
    
    canvasToImage() {
      wx.canvasToTempFilePath({
        canvasId: 'radarCanvas',
        fileType: 'jpg',
        quality: 1, // 提高图片质量
        success: (res) => {
          this.setData({
            radarImage: res.tempFilePath
          });
        },
        fail: (err) => {
          console.error('Canvas转图片失败', err);
        }
      }, this);
    }
  }
}); 