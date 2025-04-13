// pages/message/index.js
const app = getApp();

Page({
  /** 页面的初始数据 */
  data: {
    banners: [
      {
        id: 'fish-personality',
        image: '/images/banner/banner-fish-test.png',
        testId: 'fish-personality'
      },
      {
        id: 'landscaping-score',
        image: '/images/banner/landscaping.png',
        testId: 'landscaping-score'
      }
      // 后续可添加更多轮播广告
    ],
    currentSwiperIndex: 0,
    tests: [
      {
        id: 'fish-personality',
        title: '六维养鱼性格测试',
        subtitle: '猜猜你适合养什么鱼？',
        image: '/images/banner/banner-fish-test.png',
        count: 2341,
        url: '/pages/personality-test/index'
      },
      {
        id: 'landscaping-score',
        title: '为你的鱼缸造景打分',
        subtitle: '专业水族师帮你评估鱼缸造景',
        image: '/images/banner/landscaping.png',
        count: 836,
        url: '/pages/landscaping-score/index'
      }
      // 更多测试将在这里添加
    ]
  },

  /** 生命周期函数--监听页面加载 */
  onLoad() {
    // 检查图片是否存在
    this.checkImages();
    // 加载测试数据
    this.loadTestData();
  },

  /** 检查图片是否可用 */
  checkImages() {
    const checkImage = (src) => {
      return new Promise((resolve, reject) => {
        wx.getImageInfo({
          src,
          success: (res) => {
            console.log('图片信息获取成功', res);
            resolve(true);
          },
          fail: (err) => {
            console.error('图片加载失败', err);
            resolve(false);
          }
        });
      });
    };

    Promise.all(this.data.banners.map(banner => checkImage(banner.image)))
      .then(results => {
        // 处理结果，可以在这里替换失败的图片
        const updatedBanners = [...this.data.banners];
        results.forEach((success, index) => {
          if (!success) {
            // 如果图片加载失败，使用备用图片
            updatedBanners[index].image = 'https://picsum.photos/750/360';
          }
        });
        
        this.setData({ banners: updatedBanners });
      });
  },

  /** 轮播图变化事件 */
  swiperChange(e) {
    this.setData({
      currentSwiperIndex: e.detail.current
    });
  },

  /** 上一张图片 */
  prevImage() {
    const swiperComponent = this.selectComponent('.top-banner');
    if (swiperComponent && typeof swiperComponent.prev === 'function') {
      swiperComponent.prev();
    } else {
      const current = this.data.currentSwiperIndex;
      const total = this.data.banners.length;
      const prevIndex = current > 0 ? current - 1 : total - 1;
      
      this.setData({
        currentSwiperIndex: prevIndex
      });
    }
  },

  /** 下一张图片 */
  nextImage() {
    const swiperComponent = this.selectComponent('.top-banner');
    if (swiperComponent && typeof swiperComponent.next === 'function') {
      swiperComponent.next();
    } else {
      const current = this.data.currentSwiperIndex;
      const total = this.data.banners.length;
      const nextIndex = current < total - 1 ? current + 1 : 0;
      
      this.setData({
        currentSwiperIndex: nextIndex
      });
    }
  },

  /** 生命周期函数--监听页面初次渲染完成 */
  onReady() {},

  /** 生命周期函数--监听页面显示 */
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1 // 设置消息标签页为选中状态
      });
    }
  },

  /** 生命周期函数--监听页面隐藏 */
  onHide() {},

  /** 生命周期函数--监听页面卸载 */
  onUnload() {},

  /** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh() {
    // 刷新测试数据
    this.loadTestData();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  /** 页面上拉触底事件的处理函数 */
  onReachBottom() {},

  /** 用户点击右上角分享 */
  onShareAppMessage() {
    return {
      title: '趣味测试：养鱼性格测试',
      path: '/pages/message/index',
      imageUrl: this.data.banners[0].image
    }
  },

  /** 加载测试数据 */
  loadTestData() {
    // 模拟从服务器获取数据
    // 实际项目中这里应该调用API接口
    console.log('加载测试数据');
  },

  /** 开始测试 */
  startTest(e) {
    const testId = e.currentTarget.dataset.testId;
    const test = this.data.tests.find(item => item.id === testId);
    
    if (test && test.url) {
      wx.navigateTo({
        url: test.url
      });
    } else {
      wx.showToast({
        title: '该测试暂未开放',
        icon: 'none'
      });
    }
  },

  /** 菜单按钮点击 */
  toggleMenu() {
    wx.showToast({
      title: '菜单功能即将上线',
      icon: 'none'
    });
  }
});
