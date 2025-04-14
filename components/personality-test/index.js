const personalityTestData = require('../../data/personality_test');

Component({
  data: {
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswers: [],
    showResult: false,
    testResult: null,
    dimensions: [],
    recommendations: {}
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

      this.setData({
        showResult: true,
        testResult: result
      });

      // 触发测试完成事件
      this.triggerEvent('testComplete', { result, scores });
    },

    restartTest() {
      this.setData({
        currentQuestionIndex: 0,
        selectedAnswers: [],
        showResult: false,
        testResult: null
      });
    }
  }
}); 