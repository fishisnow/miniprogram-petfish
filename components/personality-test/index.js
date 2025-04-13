import personalityTest from '../../data/personality_test';

Component({
  data: {
    currentQuestionIndex: 0,
    questions: personalityTest.questions,
    scores: {
      buddhist: 0,
      tech: 0,
      appearance: 0,
      aquascape: 0,
      diversity: 0,
      social: 0
    },
    showResult: false,
    testResult: null,
    dimensions: personalityTest.dimensions,
    recommendations: personalityTest.recommendations
  },

  methods: {
    handleOptionSelect(e) {
      const { option } = e.currentTarget.dataset;
      const scores = { ...this.data.scores };
      
      // 更新分数
      Object.entries(option.score).forEach(([dimension, score]) => {
        scores[dimension] += score;
      });

      this.setData({ scores });

      // 如果还有下一题，继续
      if (this.data.currentQuestionIndex < this.data.questions.length - 1) {
        this.setData({
          currentQuestionIndex: this.data.currentQuestionIndex + 1
        });
      } else {
        // 计算结果
        this.calculateResult();
      }
    },

    calculateResult() {
      const scores = this.data.scores;
      let maxScore = 0;
      let dominantType = '';

      // 找出得分最高的维度
      Object.entries(scores).forEach(([dimension, score]) => {
        if (score > maxScore) {
          maxScore = score;
          dominantType = dimension;
        }
      });

      const result = {
        ...this.data.recommendations[dominantType],
        scores: scores,
        dominantType
      };

      this.setData({
        showResult: true,
        testResult: result
      });

      // 触发结果事件
      this.triggerEvent('testComplete', result);
    },

    restartTest() {
      this.setData({
        currentQuestionIndex: 0,
        scores: {
          buddhist: 0,
          tech: 0,
          appearance: 0,
          aquascape: 0,
          diversity: 0,
          social: 0
        },
        showResult: false,
        testResult: null
      });
    }
  }
}); 