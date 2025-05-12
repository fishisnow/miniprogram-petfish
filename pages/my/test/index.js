Page({
  data: {
    testResult: null,
    radarImage: '',
    hasUnfinishedTest: false
  },

  onLoad() {
    this.loadTestData();
  },

  onShow() {
    // 每次显示页面时重新加载最新数据
    this.loadTestData();
  },

  // 从本地存储加载测试数据
  loadTestData() {
    try {
      // 尝试获取已完成的测试结果
      const completedTest = wx.getStorageSync('personality_test_result');
      // 尝试获取雷达图
      const radarImage = wx.getStorageSync('personality_test_radar_image');
      // 尝试获取分数
      const scores = wx.getStorageSync('personality_test_scores');
      // 尝试获取未完成的测试进度
      const unfinishedTest = wx.getStorageSync('personality_test_progress');

      // 格式化分数数据为能力列表，适合页面展示
      let abilities = [];
      if (scores && completedTest) {
        const dimensions = ['buddhist', 'tech', 'appearance', 'landscaping', 'variety', 'social'];
        const dimensionNames = ['佛系', '技术流', '颜值控', '造景', '多品种', '社交分享'];
        
        abilities = dimensions.map((dim, index) => {
          return {
            name: dimensionNames[index],
            value: scores[dim] || 0
          };
        });
      }

      if (completedTest) {
        console.log('找到已完成的测试结果:', completedTest);
        // 确保testResult对象包含abilities属性
        if (!completedTest.abilities && abilities.length > 0) {
          completedTest.abilities = abilities;
        }
        this.setData({
          testResult: completedTest,
          radarImage: radarImage || '',
          hasUnfinishedTest: false
        });
      } else if (unfinishedTest && unfinishedTest.selectedAnswers && unfinishedTest.selectedAnswers.length > 0) {
        console.log('找到未完成的测试进度:', unfinishedTest);
        this.setData({
          testResult: null,
          hasUnfinishedTest: true
        });
      } else {
        console.log('没有找到测试数据');
        this.setData({
          testResult: null,
          radarImage: '',
          hasUnfinishedTest: false
        });
      }
    } catch (error) {
      console.error('加载测试数据失败:', error);
      wx.showToast({
        title: '加载数据失败',
        icon: 'none'
      });
    }
  },

  // 开始新测试
  startTest() {
    wx.navigateTo({
      url: '/pages/personality-test/index',
    });
  },

  // 继续未完成的测试
  continueTest() {
    wx.navigateTo({
      url: '/pages/personality-test/index?continue=true',
    });
  },

  // 重新测试
  restartTest() {
    wx.showModal({
      title: '确认重新测试',
      content: '重新测试将会清除当前的测试结果，确定继续吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储的测试数据
          wx.removeStorageSync('personality_test_result');
          wx.removeStorageSync('personality_test_progress');
          wx.removeStorageSync('personality_test_radar_image');
          wx.removeStorageSync('personality_test_scores');
          
          // 跳转到测试页面
          wx.navigateTo({
            url: '/pages/personality-test/index',
          });
        }
      }
    });
  },

  // 分享测试结果
  shareResult() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 分享给朋友
  onShareAppMessage() {
    return {
      title: `我的六维养鱼性格: ${this.data.testResult ? this.data.testResult.title : '养鱼专家'}`,
      path: '/pages/home/index',
      imageUrl: this.data.radarImage || ''
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: `我的六维养鱼性格: ${this.data.testResult ? this.data.testResult.title : '养鱼专家'}`,
      imageUrl: this.data.radarImage || ''
    };
  },

  // 查看鱼类详情
  viewFishDetail(e) {
    const { id } = e.currentTarget.dataset;
    if (id) {
      wx.navigateTo({
        url: `/pages/fish/detail/index?id=${id}`
      });
    }
  },
}); 