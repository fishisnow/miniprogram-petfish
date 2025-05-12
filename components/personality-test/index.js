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
      
      // 创建一个包含整个结果页面的画布
      const query = wx.createSelectorQuery().in(this);
      query.select('.result-card').boundingClientRect();
      query.exec((res) => {
        const card = res[0];
        if (!card) {
          wx.hideLoading();
          wx.showToast({ title: '保存失败', icon: 'none' });
          return;
        }
        
        const { radarScores, radarDimensionNames } = this.data;
        
        // 使用更高质量的画布尺寸，提高清晰度
        const canvasWidth = 750;  // 两倍宽度提高清晰度
        let canvasHeight = 1400;  // 减小初始画布高度，后续会动态调整
        
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
        
        // 顶部留白和边距
        let currentY = 80;
        const marginX = 60; // 左右边距
        
        // 绘制顶部背景条
        ctx.setFillStyle(colors.primary);
        ctx.fillRect(0, 0, canvasWidth, 160);
        
        // 绘制标题
        ctx.setFontSize(44);
        ctx.setFillStyle('#ffffff');
        ctx.setTextAlign('center');
        ctx.fillText(this.data.testResult.title, canvasWidth / 2, 100);
        currentY = 180;
        
        // 绘制描述文本 - 优化长文本处理
        ctx.setFontSize(32); // 增大字体以提高可读性
        ctx.setFillStyle(colors.textPrimary);
        ctx.setTextAlign('center');
        
        const descText = this.data.testResult.description;
        const maxDescWidth = canvasWidth - marginX * 2 - 40; // 减小宽度以适应更多文本
        const lineHeight = 46; // 稍微减小行高
        
        // 改进的文本换行算法
        const breakTextIntoLines = (text, maxWidth, ctx) => {
          const lines = [];
          let line = '';
          let testLine = '';
          
          // 按标点符号作为可能的断点
          const punctuations = ['，', '。', '！', '？', '；', '：', ',', '.', '!', '?', ';', ':'];
          
          for (let i = 0; i < text.length; i++) {
            const char = text[i];
            testLine = line + char;
            
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && line.length > 0) {
              // 尝试在标点符号处断行
              let breakAtPunctuation = false;
              for (let j = line.length - 1; j >= 0; j--) {
                if (punctuations.includes(line[j]) && j > line.length - 8) { // 只检查最后几个字符
                  lines.push(line.substring(0, j + 1));
                  line = line.substring(j + 1) + char;
                  breakAtPunctuation = true;
                  break;
                }
              }
              
              if (!breakAtPunctuation) {
                lines.push(line);
                line = char;
              }
            } else {
              line = testLine;
            }
          }
          
          if (line.length > 0) {
            lines.push(line);
          }
          
          return lines;
        };
        
        const descLines = breakTextIntoLines(descText, maxDescWidth, ctx);
        
        // 绘制描述背景
        const descHeight = descLines.length * lineHeight + 50; // 增加边距
        this.drawRoundedRect(ctx, marginX, currentY, canvasWidth - marginX * 2, descHeight, 16, colors.cardBg);
        currentY += 40;
        
        // 绘制描述文本的每一行
        descLines.forEach((line) => {
          ctx.fillText(line, canvasWidth / 2, currentY);
          currentY += lineHeight;
        });
        
        currentY += 30;
        
        // 决定展示方式：由于雷达图和条形图重复展示了相同的信息
        // 我们选择只展示雷达图，并增强其视觉表现，为推荐鱼种留出更多空间
        
        // 绘制雷达图
        const radarSize = 460; // 稍微增大雷达图尺寸
        
        // 绘制雷达图卡片背景
        this.drawRoundedRect(ctx, (canvasWidth - radarSize - 40) / 2, currentY, radarSize + 40, radarSize + 40, 20, colors.cardBg);
        currentY += 20;
        
        // 绘制"性格分析"标题
        ctx.setFontSize(32);
        ctx.setFillStyle(colors.textPrimary);
        ctx.setTextAlign('center');
        ctx.fillText('性格分析', canvasWidth / 2, currentY + 24);
        currentY += 50;
        
        // 绘制高清雷达图
        this.drawHighResRadarChart(ctx, (canvasWidth - radarSize) / 2, currentY, radarSize, colors);
        currentY += radarSize + 30;
        
        // 绘制"推荐鱼种"卡片
        const fishCardTop = currentY;
        const fishCardWidth = canvasWidth - marginX * 2;
        
        // 先计算所有鱼种标签需要的高度
        ctx.setFontSize(32);
        let fishX = 20;
        let fishY = 0;
        const fishPadding = 20;
        const fishMaxWidth = fishCardWidth - 40;
        const fishList = this.data.testResult.fishes;
        let maxFishHeight = 0;
        
        // 计算鱼种区域的高度
        fishList.forEach((fish) => {
          const fishTextWidth = ctx.measureText(fish).width;
          const fishWidth = fishTextWidth + 60;
          
          if (fishX + fishWidth > fishMaxWidth) {
            fishX = 20;
            fishY += 80;
          }
          
          fishX += fishWidth + fishPadding;
          maxFishHeight = Math.max(maxFishHeight, fishY + 80);
        });
        
        // 绘制推荐鱼种卡片背景
        this.drawRoundedRect(ctx, marginX, currentY, fishCardWidth, maxFishHeight + 120, 20, colors.cardBg);
        currentY += 40;
        
        // 绘制推荐鱼种标题
        ctx.setFillStyle(colors.textPrimary);
        ctx.setFontSize(32);
        ctx.setTextAlign('center');
        ctx.fillText('推荐鱼种', canvasWidth / 2, currentY);
        currentY += 60;
        
        // 绘制鱼种列表
        fishX = marginX + 20;
        const fishStartY = currentY;
        
        // 优化绘制鱼种标签
        fishList.forEach((fish) => {
          // 计算鱼种标签宽度
          const fishTextWidth = ctx.measureText(fish).width;
          const fishWidth = fishTextWidth + 60;
          
          // 如果当前行放不下，换行
          if (fishX + fishWidth > marginX + fishCardWidth - 20) {
            fishX = marginX + 20;
            currentY += 80;
          }
          
          // 绘制鱼种标签背景 - 使用圆角矩形
          const cornerRadius = 16;
          // 随机选择一个维度颜色，增加多样性
          const dimensionIds = Object.keys(colors.dimensions);
          const randomColor = colors.dimensions[dimensionIds[Math.floor(Math.random() * dimensionIds.length)]];
          
          // 绘制半透明背景
          this.drawRoundedRect(ctx, fishX, currentY - 20, fishWidth, 40, cornerRadius, 'rgba(255, 255, 255, 0.85)');
          
          // 在标签左侧添加彩色指示条
          ctx.beginPath();
          ctx.moveTo(fishX + cornerRadius/2, currentY - 20);
          ctx.lineTo(fishX + cornerRadius/2, currentY + 20);
          ctx.setLineWidth(4);
          ctx.setStrokeStyle(randomColor);
          ctx.stroke();
          
          // 绘制鱼种名称
          ctx.setFillStyle(colors.textPrimary);
          ctx.setTextAlign('left');
          ctx.setFontSize(28);
          ctx.fillText(fish, fishX + 20, currentY + 6);
          
          // 更新X坐标，准备绘制下一个鱼种
          fishX += fishWidth + fishPadding;
        });
        
        currentY = fishStartY + maxFishHeight + 40;
        
        // 绘制底部区域和小程序码
        const footerTop = currentY;
        // 使用渐变背景使其更协调
        const grd = ctx.createLinearGradient(0, footerTop, 0, footerTop + 180);
        grd.addColorStop(0, '#f5f9f6');
        grd.addColorStop(1, '#e8f3eb');
        ctx.setFillStyle(grd);
        ctx.fillRect(0, footerTop, canvasWidth, 180);

        // 绘制底部装饰线
        ctx.beginPath();
        ctx.moveTo(0, footerTop + 1);
        ctx.lineTo(canvasWidth, footerTop + 1);
        ctx.setStrokeStyle('rgba(136, 192, 168, 0.2)');
        ctx.setLineWidth(2);
        ctx.stroke();

        // 绘制底部文字
        ctx.setFontSize(28);
        ctx.setFillStyle('#88c0a8');
        ctx.setTextAlign('center');
        const footerText = '扫描右侧二维码，测试你的养鱼性格';
        ctx.fillText(footerText, canvasWidth / 2 - 70, footerTop + 80);

        // 绘制小程序码
        wx.getFileSystemManager().readFile({
          filePath: `${wx.env.USER_DATA_PATH}/minicode.jpg`, // 临时存储的小程序码路径
          fail: () => {
            // 如果临时文件不存在，从项目路径加载
            const fs = wx.getFileSystemManager();
            fs.copyFile({
              srcPath: '/images/minicode.jpg',
              destPath: `${wx.env.USER_DATA_PATH}/minicode.jpg`,
              success: () => {
                this.drawQRCode(ctx, canvasWidth, footerTop, marginX);
              },
              fail: (err) => {
                console.error('复制小程序码失败', err);
                // 尝试直接从项目路径加载
                this.drawQRCode(ctx, canvasWidth, footerTop, marginX, '/images/minicode.jpg');
              }
            });
          },
          success: (res) => {
            this.drawQRCode(ctx, canvasWidth, footerTop, marginX, null, res.data);
          }
        });
      });
    },

    // 定义绘制小程序码的函数
    drawQRCode: function(ctx, canvasWidth, footerTop, marginX, path, qrImageData) {
      const qrSize = 120;
      const qrX = canvasWidth - marginX - qrSize - 20;
      const qrY = footerTop + 30;
      
      // 绘制小程序码背景阴影
      ctx.save();
      ctx.setShadow(0, 2, 8, 'rgba(0, 0, 0, 0.08)');
      ctx.beginPath();
      ctx.arc(qrX + qrSize/2, qrY + qrSize/2, qrSize/2 + 4, 0, Math.PI * 2);
      ctx.setFillStyle('#ffffff');
      ctx.fill();
      ctx.restore();
      
      // 绘制小程序码
      if (qrImageData) {
        wx.getFileSystemManager().writeFile({
          filePath: `${wx.env.USER_DATA_PATH}/temp_qr.jpg`,
          data: qrImageData,
          encoding: 'binary',
          success: () => {
            ctx.drawImage(`${wx.env.USER_DATA_PATH}/temp_qr.jpg`, qrX, qrY, qrSize, qrSize);
            this.finishDrawing(ctx, canvasWidth, footerTop);
          },
          fail: (err) => {
            console.error('保存临时小程序码失败', err);
            this.finishDrawing(ctx, canvasWidth, footerTop);
          }
        });
      } else if (path) {
        // 直接使用路径绘制
        try {
          ctx.drawImage(path, qrX, qrY, qrSize, qrSize);
          this.finishDrawing(ctx, canvasWidth, footerTop);
        } catch (error) {
          console.error('绘制小程序码失败', error);
          this.finishDrawing(ctx, canvasWidth, footerTop);
        }
      } else {
        // 无法绘制小程序码，只完成其他部分
        console.log('无小程序码数据，继续完成绘制');
        this.finishDrawing(ctx, canvasWidth, footerTop);
      }
    },

    // 定义完成绘制的函数
    finishDrawing: function(ctx, canvasWidth, footerTop) {
      // 更新最终画布高度
      let canvasHeight = footerTop + 180;
      
      // 添加底部版权信息
      ctx.setFontSize(22);
      ctx.setFillStyle('#88c0a8');
      ctx.setTextAlign('center');
      ctx.fillText('养鱼性格测试 · 快乐养鱼', canvasWidth / 2, canvasHeight - 24);
      
      // 完成绘制
      ctx.draw(false, () => {
        // 转换为图片，延迟800毫秒确保绘制完成
        setTimeout(() => {
          wx.canvasToTempFilePath({
            canvasId: 'resultCanvas',
            x: 0,
            y: 0,
            width: canvasWidth,
            height: canvasHeight,
            destWidth: canvasWidth,
            destHeight: canvasHeight,
            fileType: 'jpg',
            quality: 1,
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
                }
              });
            },
            fail: (err) => {
              wx.hideLoading();
              console.error('生成结果图片失败', err);
              this.tryScreenshotMethod();
            }
          }, this);
        }, 800);
      });
    },

    // 备用的截图方法
    tryScreenshotMethod: function() {
      wx.showModal({
        title: '提示',
        content: '生成图片失败，是否尝试截图方式保存？',
        success: (res) => {
          if (res.confirm) {
            // 这里可以实现截图逻辑，或者引导用户自行截图
            wx.showToast({
              title: '请使用系统截图功能保存结果',
              icon: 'none',
              duration: 3000
            });
          }
        }
      });
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

    // 绘制高清雷达图
    drawHighResRadarChart(ctx, startX, startY, size, colors) {
      const { radarScores, radarDimensionNames } = this.data;
      if (!radarScores || !radarDimensionNames || radarScores.length === 0) {
        console.error('雷达图数据不完整');
        return;
      }
      
      // 设置画布基本参数
      const centerX = startX + size / 2;
      const centerY = startY + size / 2;
      const radius = size * 0.4; // 雷达图半径
      
      // 计算维度数量和角度
      const dimensionCount = radarDimensionNames.length;
      const angleStep = Math.PI * 2 / dimensionCount;
      
      // 自适应刻度 - 找出当前数据中的最大值
      const currentMaxScore = Math.max(...radarScores);
      // 设置最小最大刻度 (如果最大值小于5，至少显示到5；否则向上取整到下一个5的倍数)
      const maxScoreDisplay = currentMaxScore <= 5 ? 5 : Math.ceil(currentMaxScore / 5) * 5;
      
      // 获取维度ID数组以确定颜色
      const dimensionIds = this.data.dimensions.map(dim => dim.id);
      
      // 绘制雷达图背景 - 使用网格图案
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 10, 0, Math.PI * 2);
      ctx.setFillStyle('#ffffff');
      ctx.fill();
      ctx.restore();
      
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
        ctx.setStrokeStyle('#e0efe7');
        ctx.setLineWidth(2);
        ctx.stroke();
        
        // 添加刻度值标签 (只在垂直方向添加)
        const scaleValue = Math.round((level / 5) * maxScoreDisplay);
        ctx.setFontSize(20);
        ctx.setFillStyle('#a6cbb8');
        ctx.setTextAlign('center');
        ctx.fillText(scaleValue.toString(), centerX, centerY - levelRadius - 10);
      }
      
      // 绘制从中心到各顶点的连线
      for (let i = 0; i < dimensionCount; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.setStrokeStyle('#e0efe7');
        ctx.setLineWidth(2);
        ctx.stroke();
      }
      
      // 绘制维度名称标签的背景圆形
      for (let i = 0; i < dimensionCount; i++) {
        const angle = i * angleStep - Math.PI / 2;
        // 标签位置略微超出图表边缘
        const labelRadius = radius * 1.15;
        const x = centerX + labelRadius * Math.cos(angle);
        const y = centerY + labelRadius * Math.sin(angle);
        
        const dimensionId = dimensionIds[i];
        const dimensionColor = colors.dimensions[dimensionId] || colors.primary;
        
        // 绘制白色背景圆
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.setFillStyle('#ffffff');
        ctx.fill();
        ctx.setStrokeStyle(dimensionColor);
        ctx.setLineWidth(2);
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
      
      // 填充数据多边形
      ctx.setFillStyle('rgba(136, 192, 168, 0.3)');
      ctx.fill();
      
      // 绘制数据多边形边框
      ctx.setStrokeStyle(colors.primary);
      ctx.setLineWidth(3);
      ctx.stroke();
      
      // 绘制各维度的名称
      ctx.setFontSize(24);
      ctx.setTextAlign('center');
      ctx.setTextBaseline('middle');
      
      for (let i = 0; i < dimensionCount; i++) {
        const angle = i * angleStep - Math.PI / 2;
        // 标签位置略微超出图表边缘
        const labelRadius = radius * 1.15;
        const x = centerX + labelRadius * Math.cos(angle);
        const y = centerY + labelRadius * Math.sin(angle);
        
        const dimensionId = dimensionIds[i];
        const dimensionColor = colors.dimensions[dimensionId] || colors.textPrimary;
        
        ctx.setFillStyle(dimensionColor);
        ctx.fillText(radarDimensionNames[i], x, y);
      }
      
      // 绘制各维度的数据点和得分
      for (let i = 0; i < dimensionCount; i++) {
        const score = radarScores[i];
        // 使用自适应刻度
        const scoreRatio = score / maxScoreDisplay;
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + radius * scoreRatio * Math.cos(angle);
        const y = centerY + radius * scoreRatio * Math.sin(angle);
        
        const dimensionId = dimensionIds[i];
        const dimensionColor = colors.dimensions[dimensionId] || colors.primary;
        
        // 绘制数据点
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.setFillStyle(dimensionColor);
        ctx.fill();
        ctx.setStrokeStyle('#ffffff');
        ctx.setLineWidth(2);
        ctx.stroke();
        
        // 在数据点内绘制分数
        ctx.setFontSize(18);
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
    }
  }
}); 