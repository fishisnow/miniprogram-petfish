Page({
  data: {
    visible: false,
    sidebar: [
      {
        title: '首页',
        url: 'pages/home/index',
        isSidebar: true,
      },
      {
        title: '快乐养鱼',
        url: 'pages/message/index',
        isSidebar: true,
      },
      {
        title: '我的',
        url: 'pages/my/index',
        isSidebar: true,
      }
    ],
    statusHeight: 0
  },

  onLoad(options) {
    // 页面加载时的初始化
    const personalityTest = this.selectComponent('#personalityTest');
    if (!personalityTest) {
      console.error('Failed to load personality test component');
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      });
    }
    
    // 检查是否是继续未完成测试的请求
    this.continueFlag = options.continue === 'true';

    const systemInfo = wx.getSystemInfoSync();
    this.setData({ statusHeight: systemInfo.statusBarHeight });
  },

  onShow() {
    // 页面显示时的处理
  },

  onTestComplete(e) {
    const result = e.detail;
    console.log('Test completed:', result); // 添加日志
    
    // 保存测试结果到本地存储
    try {
      wx.setStorageSync('personality_test_result', result.result);
      wx.setStorageSync('personality_test_scores', result.scores);
      console.log('测试结果已保存到本地');
      
      // 测试完成后，跳转到结果页面
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/my/test/index',
        });
      }, 1500); // 延迟跳转，给用户展示成功提示的时间
    } catch (error) {
      console.error('保存测试结果失败:', error);
    }
    
    wx.showToast({
      title: '测试完成！',
      icon: 'success'
    });
  },

  openDrawer() {
    this.setData({
      visible: true
    });
  },

  itemClick(e) {
    const that = this;
    const { isSidebar, url } = e.detail.item;
    if (isSidebar) {
      wx.switchTab({
        url: `/${url}`,
      }).then(() => {
        that.setData({
          visible: false,
        });
      });
    } else {
      wx.navigateTo({
        url: `/${url}`,
      }).then(() => {
        that.setData({
          visible: false,
        });
      });
    }
  }
}); 