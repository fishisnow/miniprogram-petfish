Component({
  properties: {
    url: String,
    desc: String,
    tags: Array,
    fishId: String
  },
  data: {},
  lifetimes: {
    attached() {
      // 打印组件接收到的属性，特别是标签
      console.log('card组件属性:', this.properties);
      console.log('card组件标签:', this.properties.tags);
    }
  },
  methods: {
    onClick() {
      const fishId = this.properties.fishId;
      console.log('卡片点击，鱼类ID:', fishId);
      
      if (fishId) {
        const url = `/pages/fish/detail/index?id=${fishId}`;
        console.log('即将跳转到:', url);
        
        wx.navigateTo({
          url,
          success: () => {
            console.log('导航成功');
          },
          fail: (err) => {
            console.error('导航失败:', err);
            wx.showToast({
              title: '页面跳转失败',
              icon: 'none'
            });
          }
        });
      } else {
        console.warn('缺少鱼类ID，无法跳转');
      }
    }
  },
});
