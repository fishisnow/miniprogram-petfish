Page({
  data: {},

  onTestComplete(e) {
    const result = e.detail;
    // 可以在这里处理测试结果，比如保存到服务器
    wx.showToast({
      title: '测试完成！',
      icon: 'success'
    });
  }
}); 