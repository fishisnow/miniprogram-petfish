Component({
  options: {
    styleIsolation: 'shared',
  },
  properties: {
    navType: {
      type: String,
      value: 'title',
    },
    titleText: String,
    activeTab: {
      type: String,
      value: 'recommend'
    }
  },
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
    statusHeight: 0,
  },
  lifetimes: {
    ready() {
      const statusHeight = wx.getWindowInfo().statusBarHeight;
      this.setData({ statusHeight });
    },
  },
  methods: {
    openDrawer() {
      this.setData({
        visible: true,
      });
    },
    itemClick(e) {
      const that = this;
      const { isSidebar, url } = e.detail.item;
      if (isSidebar) {
        wx.switchTab({
          url: `/${url}`,
        }).then(() => {
          // 防止点回tab时，sidebar依旧是展开模式
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
    },

    searchTurn() {
      wx.navigateTo({
        url: `/pages/search/index`,
      });
    },
    
    // 处理标签切换
    switchTab(e) {
      const value = e.currentTarget.dataset.value;
      this.setData({
        activeTab: value
      });
      // 触发自定义事件，通知父组件标签已切换
      this.triggerEvent('tabchange', { value });
    }
  },
});
