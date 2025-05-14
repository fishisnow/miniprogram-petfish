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

  pageLifetimes: {
    show: function() {
      if (this.data.showResult && this.data.testResult) {
        wx.showShareMenu({
          withShareTicket: true,
          menus: ['shareAppMessage', 'shareTimeline']
        });
      }
    }
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
      
      // 检查是否有未完成的测试
      this.loadUnfinishedTest();
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

      // 保存测试进度到本地
      this.saveTestProgress(newSelectedAnswers, currentQuestionIndex);

      // 如果是最后一题，计算结果
      if (questionIndex === questions.length - 1) {
        this.calculateResult();
      } else {
        // 延迟滑动到下一题，让用户看到选中效果
        setTimeout(() => {
          this.setData({
            currentQuestionIndex: currentQuestionIndex + 1
          });
          // 更新保存的当前问题索引
          this.saveTestProgress(newSelectedAnswers, currentQuestionIndex + 1);
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
      
      // 详细打印测试结果调试信息
      console.log('计算得出最高维度:', maxDimension);
      console.log('测试结果对象:', result);
      if (result) {
        console.log('标题:', result.title);
        console.log('描述:', result.description);
        console.log('推荐鱼种:', result.fishes);
      } else {
        console.error('未找到匹配的结果数据!');
      }

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
      }, () => {
        // 在数据设置完成后再次打印，确认数据已正确设置
        console.log('setData完成后的testResult:', this.data.testResult);
        
        // 保存测试结果到本地
        this.saveTestResult(result, scores);
      });

      // 触发测试完成事件
      this.triggerEvent('testComplete', { result, scores });
      
      // 绘制雷达图
      setTimeout(() => {
        this.drawRadarChart();
      }, 300);
      
      // 测试完成后清除测试进度
      wx.removeStorageSync('personality_test_progress');

      if (this.data.testResult && this.data.testResult.title) {
        // 继续处理
      } else {
        console.error('测试结果数据不完整');
        wx.showToast({ title: '数据加载失败', icon: 'none' });
      }
    },

    restartTest() {
      this.setData({
        currentQuestionIndex: 0,
        selectedAnswers: [],
        showResult: false,
        testResult: null
      });
      
      // 清除本地存储的测试数据
      wx.removeStorageSync('personality_test_result');
      wx.removeStorageSync('personality_test_scores');
      wx.removeStorageSync('personality_test_progress');
      wx.removeStorageSync('personality_test_radar_image');
    },

    drawRadarChart() {
      const { radarScores, radarDimensionNames } = this.data;
      if (!radarScores || !radarDimensionNames || radarScores.length === 0) {
        console.error('雷达图数据不完整');
        return;
      }
      
      // 创建canvas上下文
      const ctx = wx.createCanvasContext('radarCanvas', this);
      
      // 设置画布基本参数
      const width = 220;  // 进一步减小画布宽度
      const height = 220; // 进一步减小画布高度
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) * 0.65; // 雷达图半径
      
      // 计算维度数量和角度
      const dimensionCount = radarDimensionNames.length;
      const angleStep = Math.PI * 2 / dimensionCount;
      
      // 自适应刻度 - 找出当前数据中的最大值
      const currentMaxScore = Math.max(...radarScores);
      // 设置最小最大刻度 (如果最大值小于5，至少显示到5；否则向上取整到下一个5的倍数)
      const maxScoreDisplay = currentMaxScore <= 5 ? 5 : Math.ceil(currentMaxScore / 5) * 5;
      
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
      
      // 绘制雷达图背景多边形 (5个层级)
      for (let level = 1; level <= 5; level++) {
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
        
        // 添加刻度值标签 (只在垂直方向添加)
        const scaleValue = Math.round((level / 5) * maxScoreDisplay);
        ctx.setFontSize(8);
        ctx.setFillStyle('#999999');
        ctx.setTextAlign('center');
        ctx.fillText(scaleValue.toString(), centerX, centerY - levelRadius - 5);
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
        // 使用自适应刻度
        const scoreRatio = score / maxScoreDisplay;
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
      
      // 填充数据多边形
      ctx.setFillStyle('rgba(122, 171, 152, 0.5)');
      ctx.fill();
      
      // 绘制数据多边形边框
      ctx.setStrokeStyle('#5d6b75');
      ctx.setLineWidth(2);
      ctx.stroke();
      
      // 绘制各维度的名称
      ctx.setFontSize(10); // 进一步减小字体
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
        // 使用自适应刻度
        const scoreRatio = score / maxScoreDisplay;
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
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.setFillStyle(dimensionColor);
        ctx.fill();
        ctx.setStrokeStyle('#ffffff');
        ctx.setLineWidth(1.5);
        ctx.stroke();
      }
      
      // 完成绘制
      ctx.draw(true, () => {
        console.log('Canvas绘制完成');
        // 绘制完成后，将canvas转为图片
        setTimeout(() => {
          this.canvasToImage();
        }, 200);
      });
    },
    
    canvasToImage() {
      wx.canvasToTempFilePath({
        canvasId: 'radarCanvas',
        success: (res) => {
          const tempFilePath = res.tempFilePath;
          console.log('雷达图生成成功:', tempFilePath);
          
          // 保存雷达图路径到本地
          try {
            wx.setStorageSync('personality_test_radar_image', tempFilePath);
            console.log('雷达图路径已保存到本地');
          } catch (error) {
            console.error('保存雷达图路径失败:', error);
          }
          
          this.setData({
            radarImage: tempFilePath
          });
        },
        fail: (error) => {
          console.error('雷达图生成失败:', error);
        }
      }, this);
    },

    // 长按保存图片
    saveResultImage() {
      // 首先获取用户授权
      wx.getSetting({
        success: (res) => {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success: () => {
                this.saveImageToAlbum();
              },
              fail: () => {
                wx.showModal({
                  title: '提示',
                  content: '需要相册权限才能保存图片，请允许授权',
                  confirmText: '去设置',
                  success: (res) => {
                    if (res.confirm) {
                      wx.openSetting();
                    }
                  }
                });
              }
            });
          } else {
            this.saveImageToAlbum();
          }
        }
      });
    },

    saveImageToAlbum() {
      wx.showLoading({ title: '保存中...' });
      
      // 直接使用原始的canvas绘制方式，更可靠且可以保证画面效果一致性
      const { radarScores, radarDimensionNames } = this.data;
      
      // 使用手机屏幕常规尺寸的画布，提高清晰度
      const canvasWidth = 375;  // 标准手机屏幕宽度
      const canvasHeight = 667; // 初始高度，后面会根据实际内容调整
      
      const ctx = wx.createCanvasContext('resultCanvas', this);
      
      // 定义全局颜色配置
      const colors = {
        primary: '#88c0a8',     // 明亮的吉卜力绿
        secondary: '#4b6c5d',   // 较深的文本色
        background: '#ffffff',
        cardBg: '#f9fdf5',
        textPrimary: '#4b6c5d',
        textSecondary: '#758a7f',
        border: 'rgba(136, 192, 168, 0.3)',
        fishDot: '#88c0a8',     // 统一的鱼种圆点颜色
        dimensions: {
          buddhist: '#88c0a8',  // 佛系
          tech: '#5e9eb8',      // 技术控
          appearance: '#f197a3', // 颜值控
          aquascape: '#b2c75f',  // 造景控
          diversity: '#ffc266',  // 多样化
          social: '#b699cc'      // 社交型
        }
      };
      
      // 绘制白色背景
      ctx.setFillStyle(colors.background);
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // 定义边距和当前绘制位置
      const marginX = 20; // 左右边距
      const sectionGap = 20; // 增加各区域之间的间距，使布局更加宽松美观
      let currentY = 0; 
      
      // 绘制顶部背景条 - 减小高度使标题更加紧凑
      ctx.setFillStyle(colors.primary);
      ctx.fillRect(0, 0, canvasWidth, 45); // 将高度从60减少到45
      
      // 绘制标题 - 减小字体大小
      ctx.setFontSize(18); // 将字体从22减小到18
      ctx.setFillStyle('#ffffff');
      ctx.setTextAlign('center');
      ctx.fillText(this.data.testResult.title, canvasWidth / 2, 28); // 调整位置从36到28
      currentY = 45 + sectionGap; // 统一间距
      
      // 绘制描述文本 - 确保测试结果描述文字显示
      ctx.setFontSize(14); // 适当减小字体提高可读性
      ctx.setFillStyle('#000000'); // 使用纯黑色
      ctx.setTextAlign('left');
      
      // 确保描述文本存在
      const descText = this.data.testResult.description || '这种性格类型的养鱼者注重鱼缸的整体美感和生态平衡，喜欢精心设计和布置水族环境。';
      const maxDescWidth = canvasWidth - marginX * 2 - 40; // 调整宽度，确保左右边距一致
      const lineHeight = 24; // 增加行高，提高可读性
      
      // 简化文本处理方法 - 自然流动展示文本，不强制换行
      const breakTextIntoLines = (text, maxWidth, ctx) => {
        const lines = [];
        let currentLine = '';
        let words = text.split('');
        
        for (let i = 0; i < words.length; i++) {
          const char = words[i];
          const testLine = currentLine + char;
          const metrics = ctx.measureText(testLine);
          
          // 如果添加当前字符会超出最大宽度，则换行
          if (metrics.width > maxWidth && currentLine.length > 0) {
            lines.push(currentLine);
            currentLine = char;
          } else {
            currentLine = testLine;
          }
        }
        
        // 添加最后一行
        if (currentLine.length > 0) {
          lines.push(currentLine);
        }
        
        return lines;
      };
      
      const descLines = breakTextIntoLines(descText, maxDescWidth, ctx);
      
      console.log('描述文本:', descText, '长度:', descText.length);
      console.log('分行后:', descLines, '行数:', descLines.length);
      
      // 调整描述区域的高度，确保足够容纳所有文本
      const descHeight = Math.max(descLines.length * lineHeight + 40, 90); // 调整空间
      
      // 先绘制背景卡片
      this.drawRoundedRect(ctx, marginX, currentY, canvasWidth - marginX * 2, descHeight, 10, colors.cardBg);
      
      // 保存当前上下文状态
      ctx.save();
      
      // 重新设置文本样式，确保它不受之前绘制操作的影响
      ctx.setFontSize(15); // 字体尺寸
      ctx.setFillStyle('#4b6c5d'); // 使用柔和的绿色调，符合整体设计风格
      ctx.setTextAlign('left');
      ctx.setTextBaseline('middle'); // 使文本垂直居中对齐
      
      // 增加初始文本位置的垂直偏移，确保文本居中显示
      currentY += descHeight / 2 - ((descLines.length * lineHeight) / 2) + 5;
      
      // 绘制描述文本的每一行，使用符合整体风格的颜色
      descLines.forEach((line, index) => {
        console.log(`绘制第${index+1}行文本:`, line);
        // 绘制文本，取消阴影，使用轻量级样式
        ctx.setShadow(0, 0, 0, 'rgba(0, 0, 0, 0)'); // 移除阴影
        ctx.fillText(line, marginX + 20, currentY); // 增加左侧边距
        currentY += lineHeight;
      });
      
      // 恢复上下文状态
      ctx.restore();
      
      // 确保下一个区域有足够的间距
      currentY = 45 + sectionGap + descHeight + 5;
      
      // 合并雷达图和柱状图到同一区域 - 使用白色底色
      const radarSize = 200; // 雷达图尺寸
      const barHeight = 8; // 柱状图高度
      const barGap = 30; // 柱状图间距
      
      // 计算合并区域的总高度
      const chartWidth = canvasWidth - marginX * 2 - 60;
      const radarChartHeight = radarSize + 30; // 雷达图区域高度
      const barChartHeight = (barGap * radarScores.length) + 20; // 柱状图区域高度
      const combinedHeight = radarChartHeight + barChartHeight + 35; // 合并区域总高度
      
      // 绘制合并区域的背景卡片 - 使用白色底色
      this.drawRoundedRect(ctx, marginX, currentY, canvasWidth - marginX * 2, combinedHeight, 10, '#ffffff');
      
      // 绘制"性格分析"标题 - 左侧吸附样式
      ctx.save();
      ctx.setFontSize(16);
      ctx.setFillStyle(colors.primary);
      ctx.setTextAlign('left');
      ctx.fillText('性格分析', marginX + 15, currentY + 20);
      
      // 为标题添加装饰性的下划线
      ctx.beginPath();
      ctx.moveTo(marginX + 15, currentY + 30);
      ctx.lineTo(marginX + 85, currentY + 30);
      ctx.setStrokeStyle(colors.primary);
      ctx.setLineWidth(2);
      ctx.stroke();
      ctx.restore();
      
      // 更新currentY到雷达图起始位置
      currentY += 40;
      
      // 绘制更精细的雷达图
      this.drawRefinedRadarChart(ctx, (canvasWidth - radarSize) / 2, currentY, radarSize, colors);
      currentY += radarSize + 15; // 雷达图后添加间距
      
      // 定义维度ID数组以确定颜色
      const dimensionIds = this.data.dimensions.map(dim => dim.id);
      
      // 绘制每个维度的条形图
      for (let i = 0; i < radarDimensionNames.length; i++) {
        const dimensionName = radarDimensionNames[i];
        const score = radarScores[i];
        const dimensionId = dimensionIds[i];
        const dimensionColor = colors.dimensions[dimensionId] || colors.primary;
        
        // 绘制维度名称
        ctx.setFontSize(12);
        ctx.setFillStyle(colors.textPrimary);
        ctx.setTextAlign('left');
        ctx.fillText(dimensionName, marginX + 15, currentY + 4);
        
        // 绘制得分 - 确保右侧有足够间距
        ctx.setFontSize(12);
        ctx.setFillStyle(dimensionColor);
        ctx.setTextAlign('right');
        ctx.fillText(score.toString(), canvasWidth - marginX - 20, currentY + 4);
        
        currentY += 14;
        
        // 绘制条形图背景
        ctx.beginPath();
        ctx.rect(marginX + 15, currentY - barHeight / 2, chartWidth, barHeight);
        ctx.setFillStyle('#edf5f0');
        ctx.fill();
        
        // 绘制条形图数据条
        const barWidth = (score / 20) * chartWidth; // 最大分数设为20
        ctx.beginPath();
        ctx.rect(marginX + 15, currentY - barHeight / 2, barWidth, barHeight);
        
        // 创建渐变
        const grd = ctx.createLinearGradient(marginX + 15, currentY, marginX + 15 + barWidth, currentY);
        grd.addColorStop(0, dimensionColor);
        grd.addColorStop(1, this.lightenColor(dimensionColor, 30));
        ctx.setFillStyle(grd);
        ctx.fill();
        
        currentY += barGap - 14; // 调整为统一间距
      }
      
      // 增加间隔
      currentY += sectionGap; // 调整为统一间距
      
      // 处理鱼种推荐区域
      const fishCardWidth = canvasWidth - marginX * 2;
      
      // 获取鱼种列表
      let fishList = this.data.testResult.fishes || [];
      
      // 检查是否需要从对象中提取名称
      if (fishList.length > 0 && typeof fishList[0] === 'object') {
        fishList = fishList.map(fish => fish.name || '未知鱼种');
      }
      
      // 预先计算鱼种区域的高度
      let fishX = marginX + 15;
      let fishY = 0;
      const fishMaxWidth = fishCardWidth - 30;
      const fishPadding = 10;
      
      ctx.setFontSize(12);
      
      fishList.forEach((fish) => {
        const fishName = String(fish);
        const fishTextWidth = ctx.measureText(fishName).width;
        const fishWidth = fishTextWidth + 30;
        
        if (fishX + fishWidth > marginX + fishMaxWidth) {
          fishX = marginX + 15;
          fishY += 40;
        }
        
        fishX += fishWidth + fishPadding;
      });
      
      // 计算鱼种卡片所需高度
      const fishCardHeight = Math.max(80, fishY + 60);
      
      // 绘制推荐鱼种卡片背景 - 使用白色底色保持一致性
      this.drawRoundedRect(ctx, marginX, currentY, fishCardWidth, fishCardHeight, 10, '#ffffff');
      
      // 绘制推荐鱼种标题 - 左侧吸附样式
      ctx.save();
      ctx.setFontSize(16);
      ctx.setFillStyle(colors.primary);
      ctx.setTextAlign('left');
      ctx.fillText('推荐鱼种', marginX + 15, currentY + 20);
      
      // 为标题添加装饰性的下划线
      ctx.beginPath();
      ctx.moveTo(marginX + 15, currentY + 30);
      ctx.lineTo(marginX + 85, currentY + 30);
      ctx.setStrokeStyle(colors.primary);
      ctx.setLineWidth(2);
      ctx.stroke();
      ctx.restore();
      
      currentY += 40;
      
      // 绘制鱼种列表 - 重置开始位置
      fishX = marginX + 15;
      const fishStartY = currentY;
      
      ctx.setTextAlign('left');
      
      fishList.forEach((fish, index) => {
        // 计算鱼种标签宽度
        const fishName = String(fish); // 确保是字符串
        const fishTextWidth = ctx.measureText(fishName).width;
        const fishWidth = fishTextWidth + 30; // 调整宽度
        
        // 如果当前行放不下，换行
        if (fishX + fishWidth > marginX + fishMaxWidth) {
          fishX = marginX + 15;
          currentY += 40; // 调整行距
        }
        
        // 绘制鱼种标签背景
        this.drawRoundedRect(ctx, fishX, currentY - 12, fishWidth, 24, 10, 'rgba(255, 255, 255, 0.9)');
        
        // 统一使用绿色圆点
        ctx.beginPath();
        ctx.arc(fishX + 10, currentY + 4, 3, 0, Math.PI * 2); // 绘制小圆点
        ctx.setFillStyle(colors.fishDot); // 使用统一的绿色
        ctx.fill();
        
        // 绘制鱼种名称 - 确保右侧有足够间距
        ctx.setFillStyle(colors.textPrimary);
        ctx.setFontSize(12);
        ctx.fillText(fishName, fishX + 20, currentY + 4);
        
        // 更新X坐标
        fishX += fishWidth + fishPadding;
      });
      
      // 更新结束位置
      currentY = fishStartY + fishCardHeight - 20;
      
      // 绘制底部区域
      const footerTop = currentY + sectionGap;
      const footerHeight = 60; // 减小底部区域高度
      
      // 使用渐变背景
      const grd = ctx.createLinearGradient(0, footerTop, 0, footerTop + footerHeight);
      grd.addColorStop(0, '#f5f9f6');
      grd.addColorStop(1, '#e8f3eb');
      ctx.setFillStyle(grd);
      ctx.fillRect(0, footerTop, canvasWidth, footerHeight);
      
      // 绘制底部装饰线
      ctx.beginPath();
      ctx.moveTo(0, footerTop + 1);
      ctx.lineTo(canvasWidth, footerTop + 1);
      ctx.setStrokeStyle('rgba(136, 192, 168, 0.2)');
      ctx.setLineWidth(1);
      ctx.stroke();
      
      // 小程序码放在右下角
      const qrSize = 50; // 减小二维码尺寸
      const qrX = canvasWidth - qrSize - 10; // 放置在右下角
      const qrY = footerTop + (footerHeight - qrSize) / 2; // 垂直居中
      
      // 绘制小程序码背景阴影
      ctx.save();
      ctx.setShadow(0, 1, 4, 'rgba(0, 0, 0, 0.08)');
      ctx.beginPath();
      ctx.arc(qrX + qrSize/2, qrY + qrSize/2, qrSize/2 + 2, 0, Math.PI * 2);
      ctx.setFillStyle('#ffffff');
      ctx.fill();
      ctx.restore();
      
      // 绘制小程序码图片
      const minicodePath = '/images/minicode.jpg';
      ctx.drawImage(minicodePath, qrX, qrY, qrSize, qrSize);
      
      // 绘制底部文字，左侧对齐
      ctx.setFontSize(14);
      ctx.setFillStyle('#88c0a8');
      ctx.setTextAlign('left');
      const footerText = '扫码测试你的养鱼性格';
      ctx.fillText(footerText, marginX, footerTop + footerHeight/2 + 5);
      
      // 修正最终画布高度
      const finalHeight = footerTop + footerHeight;
      
      // 完成绘制
      ctx.draw(true, () => {
        console.log('Canvas绘制完成');
        // 延长转换图片的等待时间，确保完全绘制完成
        setTimeout(() => {
          wx.canvasToTempFilePath({
            canvasId: 'resultCanvas',
            x: 0,
            y: 0,
            width: canvasWidth,
            height: finalHeight,
            destWidth: canvasWidth * 3, // 增加分辨率倍数，提高清晰度
            destHeight: finalHeight * 3, // 增加分辨率倍数，提高清晰度
            fileType: 'jpg',
            quality: 1, // 使用最高质量
            success: (res) => {
              wx.hideLoading();
              // 保存到相册
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => {
                  wx.showToast({ title: '保存成功', icon: 'success' });
                },
                fail: (err) => {
                  console.error('保存图片失败', err);
                  wx.showToast({ title: '保存失败', icon: 'none' });
                  // 尝试使用备用方案
                  setTimeout(() => {
                    this.tryScreenshotMethod();
                  }, 500);
                }
              });
            },
            fail: (err) => {
              wx.hideLoading();
              console.error('生成结果图片失败', err);
              // 失败重试一次，使用较低的分辨率
              console.log('尝试再次生成图片...');
              setTimeout(() => {
                wx.canvasToTempFilePath({
                  canvasId: 'resultCanvas',
                  x: 0,
                  y: 0,
                  width: canvasWidth,
                  height: finalHeight,
                  destWidth: canvasWidth * 2, // 使用较低的倍数
                  destHeight: finalHeight * 2, // 使用较低的倍数
                  fileType: 'jpg',
                  quality: 0.9, // 稍微降低质量，提高成功率
                  success: (res) => {
                    wx.saveImageToPhotosAlbum({
                      filePath: res.tempFilePath,
                      success: () => {
                        wx.showToast({ title: '保存成功', icon: 'success' });
                      },
                      fail: (err) => {
                        wx.showToast({ title: '保存失败', icon: 'none' });
                        this.tryScreenshotMethod();
                      }
                    });
                  },
                  fail: (err) => {
                    console.error('二次尝试生成图片也失败:', err);
                    wx.showToast({ title: '生成图片失败', icon: 'none' });
                    this.tryScreenshotMethod();
                  }
                }, this);
              }, 500);
            }
          }, this);
        }, 1000); // 适当调整等待时间
      });
    },

    // 添加辅助方法：颜色变亮
    lightenColor(color, percent) {
      // 转换hex为rgb
      const hex = color.replace('#', '');
      let r = parseInt(hex.substring(0, 2), 16);
      let g = parseInt(hex.substring(2, 4), 16);
      let b = parseInt(hex.substring(4, 6), 16);
      
      // 变亮
      r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
      g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
      b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
      
      // 转回hex
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    },

    // 绘制圆角矩形
    drawRoundedRect(ctx, x, y, width, height, radius, fillColor) {
      // 开始绘制
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.arcTo(x + width, y, x + width, y + radius, radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
      ctx.lineTo(x + radius, y + height);
      ctx.arcTo(x, y + height, x, y + height - radius, radius);
      ctx.lineTo(x, y + radius);
      ctx.arcTo(x, y, x + radius, y, radius);
      ctx.closePath();
      
      // 填充
      ctx.setFillStyle(fillColor);
      ctx.fill();
      
      // 添加淡色边框
      ctx.setStrokeStyle('rgba(136, 192, 168, 0.2)');
      ctx.setLineWidth(2);
      ctx.stroke();
    },

    // 新增绘制更细腻雷达图的方法
    drawRefinedRadarChart(ctx, startX, startY, size, colors) {
      const { radarScores, radarDimensionNames } = this.data;
      if (!radarScores || !radarDimensionNames || radarScores.length === 0) {
        console.error('雷达图数据不完整');
        return;
      }
      
      // 设置画布基本参数
      const centerX = startX + size / 2;
      const centerY = startY + size / 2;
      const radius = size * 0.42; // 雷达图半径
      
      // 计算维度数量和角度
      const dimensionCount = radarDimensionNames.length;
      const angleStep = Math.PI * 2 / dimensionCount;
      
      // 自适应刻度 - 找出当前数据中的最大值
      const currentMaxScore = Math.max(...radarScores);
      // 设置最小最大刻度 (如果最大值小于5，至少显示到5；否则向上取整到下一个5的倍数)
      const maxScoreDisplay = currentMaxScore <= 5 ? 5 : Math.ceil(currentMaxScore / 5) * 5;
      
      // 获取维度ID数组以确定颜色
      const dimensionIds = this.data.dimensions.map(dim => dim.id);
      
      // 绘制雷达图背景 - 使用更细腻的网格图案
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
      ctx.setFillStyle('#fafafa');
      ctx.fill();
      ctx.restore();
      
      // 绘制雷达图背景多边形 (5个层级)，使用更细的线条
      for (let level = 1; level <= 5; level++) {
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
        ctx.setStrokeStyle('#e8f0eb');
        ctx.setLineWidth(1);  // 使用更细的线条
        ctx.stroke();
        
        // 添加刻度值标签 (只在垂直方向添加)
        if (level === 5 || level === 3 || level === 1) {  // 只在关键层级添加刻度
          const scaleValue = Math.round((level / 5) * maxScoreDisplay);
          ctx.setFontSize(10);  // 减小字体从16到10
          ctx.setFillStyle('#a6cbb8');
          ctx.setTextAlign('center');
          ctx.fillText(scaleValue.toString(), centerX, centerY - levelRadius - 3);
        }
      }
      
      // 绘制从中心到各顶点的连线 - 使用更细的线条
      for (let i = 0; i < dimensionCount; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.setStrokeStyle('#e0efe7');
        ctx.setLineWidth(1);  // 使用更细的线条
        ctx.stroke();
      }
      
      // 去掉维度名称标签的背景圆形
      
      // 绘制数据多边形
      ctx.beginPath();
      for (let i = 0; i < dimensionCount; i++) {
        const score = radarScores[i];
        // 使用自适应刻度
        const scoreRatio = score / maxScoreDisplay;
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
      
      // 填充数据多边形 - 使用更透明的填充
      ctx.setFillStyle('rgba(136, 192, 168, 0.25)');  // 更透明
      ctx.fill();
      
      // 绘制数据多边形边框 - 使用更细的线条
      ctx.setStrokeStyle(colors.primary);
      ctx.setLineWidth(1.5);  // 更细的线条
      ctx.stroke();
      
      // 绘制各维度的名称 - 使用更小的字体
      ctx.setFontSize(12);  // 更小的字体从20减到12
      ctx.setTextAlign('center');
      ctx.setTextBaseline('middle');
      
      for (let i = 0; i < dimensionCount; i++) {
        const angle = i * angleStep - Math.PI / 2;
        // 标签位置略微超出图表边缘
        const labelRadius = radius * 1.15;
        const x = centerX + labelRadius * Math.cos(angle);
        const y = centerY + labelRadius * Math.sin(angle);
        
        const dimensionId = dimensionIds[i];
        const dimensionColor = colors.dimensions[dimensionId] || colors.primary;
        
        ctx.setFillStyle(dimensionColor);
        ctx.fillText(radarDimensionNames[i], x, y);
      }
      
      // 绘制各维度的数据点和得分 - 使用更小的数据点
      for (let i = 0; i < dimensionCount; i++) {
        const score = radarScores[i];
        // 使用自适应刻度
        const scoreRatio = score / maxScoreDisplay;
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + radius * scoreRatio * Math.cos(angle);
        const y = centerY + radius * scoreRatio * Math.sin(angle);
        
        const dimensionId = dimensionIds[i];
        const dimensionColor = colors.dimensions[dimensionId] || colors.primary;
        
        // 绘制数据点 - 更小的点
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);  // 更小的点从8减到5
        ctx.setFillStyle(dimensionColor);
        ctx.fill();
        ctx.setStrokeStyle('#ffffff');
        ctx.setLineWidth(1);  // 更细的边框
        ctx.stroke();
        
        // 在数据点内绘制分数 - 使用更小的字体
        ctx.setFontSize(10);  // 更小的字体从14减到10
        ctx.setFillStyle('#ffffff');
        ctx.setTextAlign('center');
        ctx.setTextBaseline('middle');
        ctx.fillText(score.toString(), x, y);
      }
    },

    // 用户点击右上角分享或分享按钮
    onShareAppMessage() {
      if (this.data.showResult && this.data.testResult) {
        return {
          title: `我的养鱼性格是：${this.data.testResult.title}`,
          path: '/pages/personality-test/index',
          imageUrl: this.data.radarImage || '' // 使用雷达图作为分享图片
        };
      }
      return {
        title: '来测测你的养鱼性格吧！',
        path: '/pages/personality-test/index'
      };
    },
    
    // 分享到朋友圈
    onShareTimeline() {
      if (this.data.showResult && this.data.testResult) {
        return {
          title: `我的养鱼性格是：${this.data.testResult.title}`,
          imageUrl: this.data.radarImage || ''
        };
      }
      return {
        title: '来测测你的养鱼性格吧！'
      };
    },

    // 新增方法：加载未完成的测试数据
    loadUnfinishedTest() {
      try {
        const unfinishedTest = wx.getStorageSync('personality_test_progress');
        if (unfinishedTest) {
          console.log('找到未完成的测试:', unfinishedTest);
          // 如果有答案数据，则加载它们
          if (unfinishedTest.selectedAnswers && unfinishedTest.selectedAnswers.length > 0) {
            // 取决于URL参数是否要继续，若是我的测试页面跳转来的continue=true则继续测试
            const pages = getCurrentPages();
            const currentPage = pages[pages.length - 1];
            // 检查URL参数中是否有continue=true
            if (currentPage && currentPage.options && currentPage.options.continue === 'true') {
              console.log('继续未完成的测试');
              this.setData({
                selectedAnswers: unfinishedTest.selectedAnswers,
                currentQuestionIndex: unfinishedTest.currentQuestionIndex || unfinishedTest.selectedAnswers.length
              });
              // 显示继续测试的提示
              wx.showToast({
                title: '继续上次测试',
                icon: 'success'
              });
            }
          }
        }
      } catch (error) {
        console.error('加载未完成测试失败:', error);
      }
    },

    // 新增方法：保存测试进度
    saveTestProgress(selectedAnswers, currentQuestionIndex) {
      try {
        wx.setStorageSync('personality_test_progress', {
          selectedAnswers,
          currentQuestionIndex,
          timestamp: new Date().getTime()
        });
        console.log('测试进度已保存');
      } catch (error) {
        console.error('保存测试进度失败:', error);
      }
    },

    // 新增方法：保存测试结果到本地
    saveTestResult(result, scores) {
      try {
        // 确保鱼种信息是正确的格式
        if (result && result.fishes) {
          // 如果fishes是字符串数组，转换为对象数组以在"我的测试"页面正确显示
          if (typeof result.fishes[0] === 'string') {
            const fishNames = result.fishes;
            result.fishes = fishNames.map((name, index) => {
              return {
                id: 'fish_' + (index + 1), // 创建一个临时ID
                name: name
              };
            });
          }
        }
        
        wx.setStorageSync('personality_test_result', result);
        wx.setStorageSync('personality_test_scores', scores);
        console.log('测试结果已保存到本地, 包含推荐鱼种:', result.fishes);
      } catch (error) {
        console.error('保存测试结果失败:', error);
      }
    },

    // 备用的截图方法
    tryScreenshotMethod: function() {
      wx.showModal({
        title: '提示',
        content: '生成图片失败，是否尝试截图方式保存？',
        success: (res) => {
          if (res.confirm) {
            // 在用户确认后，提供使用系统截图的指导
            wx.showToast({
              title: '请使用系统截图功能保存结果',
              icon: 'none',
              duration: 3000
            });
          }
        }
      });
    }
  }
}); 