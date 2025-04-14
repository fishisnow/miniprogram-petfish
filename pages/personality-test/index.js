Page({
  data: {},

  onLoad() {
    // 页面加载时的初始化
    const personalityTest = this.selectComponent('#personalityTest');
    if (!personalityTest) {
      console.error('Failed to load personality test component');
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      });
    }
  },

  onShow() {
    // 页面显示时的处理
  },

  onTestComplete(e) {
    const result = e.detail;
    console.log('Test completed:', result); // 添加日志
    // 可以在这里处理测试结果，比如保存到服务器
    wx.showToast({
      title: '测试完成！',
      icon: 'success'
    });
  }
}); 