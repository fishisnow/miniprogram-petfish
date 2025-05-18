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
      const canvasHeight = 800; // 增加高度以确保内容不被压缩
      
      const ctx = wx.createCanvasContext('resultCanvas', this);
      
      // 定义全局颜色配置
      const colors = {
        primary: '#88c0a8',     // 明亮的吉卜力绿
        secondary: '#4b6c5d',   // 较深的文本色
        background: '#ffffff',
        cardBg: '#f9fdf5',      // 淡绿色卡片底色
        textPrimary: '#4b6c5d', // 主要文本颜色
        textSecondary: '#758a7f', // 次要文本颜色
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
      const marginX = 15; // 减小左右边距
      const sectionGap = 16; // 减小各区域之间的间距
      let currentY = 0; 
      
      // 绘制顶部背景条 - 减小高度使标题更加紧凑
      ctx.setFillStyle(colors.primary);
      ctx.fillRect(0, 0, canvasWidth, 50); // 略微增加高度，使标题更突出
      
      // 绘制标题 - 调整字体大小
      ctx.setFontSize(20); // 增大字体从18到20
      ctx.setFillStyle('#ffffff');
      ctx.setTextAlign('center');
      ctx.fillText(this.data.testResult.title, canvasWidth / 2, 32); // 调整位置使其垂直居中
      currentY = 50 + sectionGap; // 统一间距
      
      // 绘制描述文本 - 确保测试结果描述文字显示
      ctx.setFontSize(15); // 略微增大字体提高可读性
      ctx.setFillStyle(colors.textPrimary); // 使用主题色而不是纯黑色，更柔和
      ctx.setTextAlign('left');
      
      // 确保描述文本存在
      const descText = this.data.testResult.description || '这种性格类型的养鱼者注重鱼缸的整体美感和生态平衡，喜欢精心设计和布置水族环境。';
      const maxDescWidth = canvasWidth - marginX * 2 - 30; // 调整宽度，确保左右边距一致但不过大
      const lineHeight = 24; // 增加行高，提高可读性
      
      // 文本处理方法 - 自然流动展示文本，不强制换行
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
      const descHeight = Math.max(descLines.length * lineHeight + 40, 100); // 增加最小高度
      
      // 先绘制背景卡片
      this.drawRoundedRect(ctx, marginX, currentY, canvasWidth - marginX * 2, descHeight, 12, colors.cardBg);
      
      // 保存当前上下文状态
      ctx.save();
      
      // 重新设置文本样式，确保它不受之前绘制操作的影响
      ctx.setFontSize(15); // 字体尺寸
      ctx.setFillStyle(colors.textPrimary); // 使用柔和的绿色调，符合整体设计风格
      ctx.setTextAlign('left');
      ctx.setTextBaseline('middle'); // 使文本垂直居中对齐
      
      // 增加初始文本位置的垂直偏移，确保文本居中显示
      let descY = currentY + 25; // 起始位置更靠上一些
      
      // 绘制描述文本的每一行，使用符合整体风格的颜色
      descLines.forEach((line, index) => {
        console.log(`绘制第${index+1}行文本:`, line);
        ctx.setShadow(0, 0, 0, 'rgba(0, 0, 0, 0)'); // 移除阴影
        ctx.fillText(line, marginX + 16, descY); // 增加左侧边距
        descY += lineHeight;
      });
      
      // 恢复上下文状态
      ctx.restore();
      
      // 更新当前Y位置到下一区域
      currentY = currentY + descHeight + sectionGap;
      
      // 合并雷达图和柱状图到同一区域 - 使用白色底色
      const radarSize = 220; // 增大雷达图尺寸
      const barHeight = 10; // 增加柱状图高度
      const barGap = 32; // 增加柱状图间距
      
      // 计算合并区域的总高度
      const chartWidth = canvasWidth - marginX * 2 - 50;
      const radarChartHeight = radarSize + 20; // 减小雷达图区域高度
      const barChartHeight = (barGap * radarScores.length + 30); // 适当减小柱状图区域高度
      const combinedHeight = radarChartHeight + barChartHeight + 50; // 减小多余空白区域
      
      // 绘制合并区域的背景卡片 - 使用白色底色，减轻边框
      this.drawRoundedRect(ctx, marginX, currentY, canvasWidth - marginX * 2, combinedHeight, 12, '#ffffff', 0.1);
      
      // 绘制"性格分析"标题 - 左侧竖条样式
      ctx.save();
      // 添加左侧竖条装饰
      ctx.beginPath();
      ctx.rect(marginX + 8, currentY + 16, 3, 18);
      ctx.setFillStyle('#88c0a8');
      ctx.fill();
      
      ctx.setFontSize(16);
      ctx.setFillStyle('#4b6c5d');
      ctx.setTextAlign('left');
      ctx.fillText('性格分析', marginX + 16, currentY + 26);
      ctx.restore();
      
      // 更新currentY到雷达图起始位置
      currentY += 50;
      
      // 调整雷达图尺寸，使其更接近原页面
      const adjustedRadarSize = 190; // 减小雷达图尺寸
      
      // 绘制更精细的雷达图
      this.drawRefinedRadarChart(ctx, (canvasWidth - adjustedRadarSize) / 2, currentY, adjustedRadarSize, colors);
      currentY += adjustedRadarSize + 30; // 增加雷达图与柱状图间距
      
      // 定义维度ID数组以确定颜色
      const dimensionIds = this.data.dimensions.map(dim => dim.id);
      
      // 绘制每个维度的条形图
      for (let i = 0; i < radarDimensionNames.length; i++) {
        const dimensionName = radarDimensionNames[i];
        const score = radarScores[i];
        const dimensionId = dimensionIds[i];
        const dimensionColor = colors.dimensions[dimensionId] || colors.primary;
        
        // 移除背景灰色条，直接绘制文字
        ctx.save();
        ctx.setShadow(0, 0, 0, 'rgba(0,0,0,0)'); // 确保没有阴影效果
        ctx.setFontSize(13); // 减小字体
        ctx.setFillStyle('#4b6c5d');
        ctx.setTextAlign('left');
        ctx.fillText(dimensionName, marginX + 20, currentY); // 调整位置稍微靠左一点
        
        // 绘制得分 - 修改位置和样式保证不溢出
        ctx.setFontSize(13); // 与维度名称一致
        ctx.setFillStyle(dimensionColor);
        ctx.setTextAlign('right');
        // 确保得分数字不会太靠边缘
        ctx.fillText(score.toString(), canvasWidth - marginX - 28, currentY);
        ctx.restore();
        
        currentY += 16; // 减小文字与柱状图之间的间距
        
        // 绘制条形图背景 - 使用更淡的灰色
        ctx.beginPath();
        ctx.rect(marginX + 16, currentY - barHeight / 2, chartWidth, barHeight);
        ctx.setFillStyle('#f5f5f5'); // 更淡的背景色
        ctx.fill();
        
        // 绘制条形图数据条 - 只绘制得分比例部分
        const barWidth = (score / 20) * chartWidth; // 最大分数设为20
        ctx.beginPath();
        ctx.rect(marginX + 16, currentY - barHeight / 2, barWidth, barHeight);
        
        // 使用对应维度的纯色而非渐变，稍微降低饱和度
        let color = dimensionColor;
        if (dimensionId === 'buddhist') color = '#8bc1ac'; // 略微调淡
        else if (dimensionId === 'tech') color = '#6fabc6'; // 略微调淡
        else if (dimensionId === 'appearance') color = '#f0a0a8'; // 略微调淡
        else if (dimensionId === 'aquascape') color = '#b4cb7a'; // 略微调淡
        else if (dimensionId === 'diversity') color = '#ffd080'; // 略微调淡
        else if (dimensionId === 'social') color = '#c8afd8'; // 略微调淡
        
        ctx.setFillStyle(color);
        ctx.fill();
        
        currentY += 24; // 减小每个条形图之间的间距
      }
      
      // 增加间隔，调整与下一区域的间距
      currentY += sectionGap;
      
      // 处理鱼种推荐区域
      const fishCardWidth = canvasWidth - marginX * 2;
      
      // 获取鱼种列表
      let fishList = this.data.testResult.fishes || [];
      
      // 检查是否需要从对象中提取名称
      if (fishList.length > 0 && typeof fishList[0] === 'object') {
        fishList = fishList.map(fish => fish.name || '未知鱼种');
      }
      
      // 预先计算鱼种区域的高度
      let fishX = marginX + 16;
      const fishMaxWidth = fishCardWidth - 30;
      const fishPadding = 16; // 调整鱼种标签之间的间距
      
      ctx.setFontSize(14);
      
      // 先模拟排列，计算需要的行数
      let rowCount = 1; // 至少有一行
      let simulateX = fishX;
      
      fishList.forEach((fish) => {
        const fishName = String(fish);
        const fishTextWidth = ctx.measureText(fishName).width;
        const fishWidth = fishTextWidth + 40; // 调整宽度更接近原页面
        
        // 检查是否需要换行
        if (simulateX + fishWidth > marginX + fishMaxWidth) {
          simulateX = marginX + 16; // 重置X位置到行首
          rowCount++; // 行数加1
        }
        
        simulateX += fishWidth + fishPadding;
      });
      
      console.log('鱼种行数计算：', rowCount);
      
      // 计算鱼种卡片所需高度 - 基于行数动态计算
      // 标题高度 + 每行高度 + 底部边距
      const titleHeight = 60; // 标题区域高度
      const rowHeight = 45; // 每行鱼种高度
      const bottomMargin = 30; // 底部边距
      
      // 计算最终卡片高度 = 标题 + 所有行 + 底部边距
      const fishCardHeight = titleHeight + (rowCount * rowHeight) + bottomMargin;
      
      console.log('计算的鱼种卡片高度:', fishCardHeight);
      
      // 绘制推荐鱼种卡片背景 - 调整为与页面一致的淡绿色
      this.drawRoundedRect(ctx, marginX, currentY, fishCardWidth, fishCardHeight, 12, '#f9fdf5', 0.1);
      
      // 绘制推荐鱼种标题 - 左侧竖条样式
      ctx.save();
      ctx.setShadow(0, 0, 0, 'rgba(0,0,0,0)'); // 确保没有阴影效果
      // 添加左侧竖条装饰
      ctx.beginPath();
      ctx.rect(marginX + 8, currentY + 16, 3, 18);
      ctx.setFillStyle('#88c0a8');
      ctx.fill();
      
      ctx.setFontSize(16);
      ctx.setFillStyle('#4b6c5d');
      ctx.setTextAlign('left');
      ctx.fillText('推荐鱼种', marginX + 16, currentY + 26);
      ctx.restore();
      
      // 绘制鱼种列表 - 重置开始位置
      fishX = marginX + 24;
      const fishStartY = currentY + 60; // 从标题下方开始第一行
      currentY = fishStartY;
      
      ctx.setTextAlign('left');
      
      fishList.forEach((fish, index) => {
        // 计算鱼种标签宽度
        const fishName = String(fish);
        const fishTextWidth = ctx.measureText(fishName).width;
        const fishWidth = fishTextWidth + 40;
        
        // 如果当前行放不下，换行
        if (fishX + fishWidth > marginX + fishMaxWidth) {
          fishX = marginX + 24;
          currentY += 45;
        }
        
        // 绘制鱼种标签 - 圆角胶囊样式，更接近原页面的样式
        this.drawRoundedRect(ctx, fishX, currentY - 16, fishWidth, 32, 16, '#ffffff', 0.1);
        
        // 绘制小圆点
        ctx.save();
        ctx.setShadow(0, 0, 0, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(fishX + 14, currentY, 4, 0, Math.PI * 2);
        ctx.setFillStyle('#88c0a8');
        ctx.fill();
        
        // 绘制鱼种名称 - 调整位置和颜色
        ctx.setFillStyle('#4b6c5d'); // 更柔和的文字颜色
        ctx.setFontSize(13); // 稍微减小字体
        ctx.fillText(fishName, fishX + 24, currentY);
        ctx.restore();
        
        // 更新X坐标
        fishX += fishWidth + fishPadding;
      });
      
      // 更新结束位置
      currentY = fishStartY + fishCardHeight - 20;
      
      // 绘制底部区域
      const footerTop = currentY + sectionGap;
      const footerHeight = 70; // 增大底部区域高度
      
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
      const qrSize = 55; // 稍微增大二维码尺寸
      const qrX = canvasWidth - qrSize - 15; // 放置在右下角，增加边距
      const qrY = footerTop + (footerHeight - qrSize) / 2; // 垂直居中
      
      // 绘制小程序码背景阴影
      ctx.save();
      ctx.setShadow(0, 2, 6, 'rgba(0, 0, 0, 0.12)');
      ctx.beginPath();
      ctx.arc(qrX + qrSize/2, qrY + qrSize/2, qrSize/2 + 2, 0, Math.PI * 2);
      ctx.setFillStyle('#ffffff');
      ctx.fill();
      ctx.restore();
      
      // 绘制小程序码图片
      const minicodePath = '/images/minicode.jpg';
      ctx.drawImage(minicodePath, qrX, qrY, qrSize, qrSize);
      
      // 绘制底部文字，左侧对齐
      ctx.save();
      ctx.setShadow(0, 0, 0, 'rgba(0,0,0,0)'); // 确保没有阴影效果
      ctx.setFontSize(15);
      ctx.setFillStyle('#88c0a8');
      ctx.setTextAlign('left');
      const footerText = '扫码测试你的养鱼性格';
      ctx.fillText(footerText, marginX + 5, footerTop + footerHeight/2 + 5);
      ctx.restore();
      
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
            destWidth: canvasWidth * 4, // 增加分辨率倍数，提高清晰度
            destHeight: finalHeight * 4, // 增加分辨率倍数，提高清晰度
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
                  destWidth: canvasWidth * 3, // 使用较低的倍数但仍保持高清晰度
                  destHeight: finalHeight * 3, // 使用较低的倍数但仍保持高清晰度
                  fileType: 'jpg',
                  quality: 0.95, // 稍微降低质量，提高成功率
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
    drawRoundedRect(ctx, x, y, width, height, radius, fillColor, shadowPercent = 0.05) {
      // 添加轻微阴影效果，使卡片看起来更立体
      ctx.save();
      ctx.setShadow(0, 2, 8, `rgba(0, 0, 0, ${shadowPercent})`);

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
      
      // 移除阴影，绘制边框
      ctx.setShadow(0, 0, 0, 'rgba(0, 0, 0, 0)');
      
      // 添加淡色边框，更加精致
      ctx.setStrokeStyle('rgba(136, 192, 168, 0.15)');
      ctx.setLineWidth(1);
      ctx.stroke();
      
      ctx.restore();
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
      const radius = size * 0.4; // 雷达图半径略小
      
      // 计算维度数量和角度
      const dimensionCount = radarDimensionNames.length;
      const angleStep = Math.PI * 2 / dimensionCount;
      
      // 自适应刻度 - 找出当前数据中的最大值
      const currentMaxScore = Math.max(...radarScores);
      // 设置最小最大刻度 (如果最大值小于5，至少显示到5；否则向上取整到下一个5的倍数)
      const maxScoreDisplay = currentMaxScore <= 5 ? 5 : Math.ceil(currentMaxScore / 5) * 5;
      
      // 获取维度ID数组以确定颜色
      const dimensionIds = this.data.dimensions.map(dim => dim.id);
      
      // 绘制雷达图背景 - 使用更柔和的圆形背景
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 18, 0, Math.PI * 2);
      ctx.setFillStyle('#f9f9f9'); // 极淡的背景色，接近原页面
      ctx.fill();
      ctx.restore();
      
      // 绘制雷达图背景多边形 (5个层级)，使用更精细的线条
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
        ctx.setStrokeStyle('#e9e9e9'); // 更浅的线条颜色接近原页面
        ctx.setLineWidth(0.7);  // 使用更细的线条
        ctx.stroke();
      }
      
      // 绘制从中心到各顶点的连线 - 使用更精细的线条
      for (let i = 0; i < dimensionCount; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.setStrokeStyle('#e3e3e3'); // 更浅的线条颜色接近原页面
        ctx.setLineWidth(0.7);  // 使用更细的线条
        ctx.stroke();
      }
      
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
      
      // 填充数据多边形 - 使用更淡的填充更接近原页面
      ctx.setFillStyle('rgba(136, 192, 168, 0.15)');  // 更淡的填充色
      ctx.fill();
      
      // 绘制数据多边形边框 - 使用更清晰的线条，贴近原页面
      ctx.setStrokeStyle('#5d9e85'); // 使用更深色的边框，但透明度更低
      ctx.setLineWidth(1.2);  
      ctx.stroke();
      
      // 绘制各维度的名称 - 简化标签显示
      ctx.setFontSize(11);  // 减小字体大小与原页面一致
      ctx.setTextAlign('center');
      ctx.setTextBaseline('middle');
      
      for (let i = 0; i < dimensionCount; i++) {
        const angle = i * angleStep - Math.PI / 2;
        // 标签位置略微超出图表边缘
        const labelRadius = radius * 1.25;
        const x = centerX + labelRadius * Math.cos(angle);
        const y = centerY + labelRadius * Math.sin(angle);
        
        const dimensionId = dimensionIds[i];
        // 根据维度选择合适的颜色，但调淡
        let dimensionColor;
        if (dimensionId === 'buddhist') dimensionColor = '#8bc1ac';
        else if (dimensionId === 'tech') dimensionColor = '#6fabc6';
        else if (dimensionId === 'appearance') dimensionColor = '#f0a0a8';
        else if (dimensionId === 'aquascape') dimensionColor = '#b4cb7a';
        else if (dimensionId === 'diversity') dimensionColor = '#ffd080';
        else if (dimensionId === 'social') dimensionColor = '#c8afd8';
        else dimensionColor = '#88c0a8';
        
        // 绘制标签文字 - 淡色文字
        ctx.setFillStyle(dimensionColor);
        ctx.fillText(radarDimensionNames[i], x, y);
      }
      
      // 绘制各维度的数据点 - 更小更精致的数据点
      for (let i = 0; i < dimensionCount; i++) {
        const score = radarScores[i];
        // 使用自适应刻度
        const scoreRatio = score / maxScoreDisplay;
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + radius * scoreRatio * Math.cos(angle);
        const y = centerY + radius * scoreRatio * Math.sin(angle);
        
        const dimensionId = dimensionIds[i];
        // 使用相同的颜色选择逻辑
        let dimensionColor;
        if (dimensionId === 'buddhist') dimensionColor = '#8bc1ac';
        else if (dimensionId === 'tech') dimensionColor = '#6fabc6';
        else if (dimensionId === 'appearance') dimensionColor = '#f0a0a8';
        else if (dimensionId === 'aquascape') dimensionColor = '#b4cb7a';
        else if (dimensionId === 'diversity') dimensionColor = '#ffd080';
        else if (dimensionId === 'social') dimensionColor = '#c8afd8';
        else dimensionColor = '#88c0a8';
        
        // 简化数据点，更接近原页面的小圆点
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2); // 更小的圆点
        ctx.setFillStyle(dimensionColor);
        ctx.fill();
        ctx.setStrokeStyle('#ffffff');
        ctx.setLineWidth(0.8);
        ctx.stroke();
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