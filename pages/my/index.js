import request from '~/api/request';
import useToastBehavior from '~/behaviors/useToast';

Page({
  behaviors: [useToastBehavior],

  data: {
    isLoad: false,
    personalInfo: {},
    listItems: [
      {
        name: '我的收藏', 
        icon: 'heart', 
        type: 'favorites', 
        url: '/pages/my/favorites/index',
        description: '查看已收藏的宠物鱼'
      },
      {
        name: '我的测试', 
        icon: 'chart-pie', 
        type: 'test', 
        url: '/pages/my/test/index',
        description: '养鱼性格测试结果'
      }
    ]
  },

  async onShow() {
    const Token = wx.getStorageSync('access_token');
    const personalInfo = await this.getPersonalInfo();

    if (Token) {
      this.setData({
        isLoad: true,
        personalInfo,
      });
    }
  },

  async getPersonalInfo() {
    const info = await request('/api/genPersonalInfo').then((res) => res.data.data);
    return info;
  },

  onLogin(e) {
    wx.navigateTo({
      url: '/pages/login/login',
    });
  },

  onNavigateTo() {
    wx.navigateTo({ url: `/pages/my/info-edit/index` });
  },

  onItemClick(e) {
    const { data } = e.currentTarget.dataset;
    const { url } = data;
    
    if (url) {
      wx.navigateTo({ url });
      return;
    }
    
    this.onShowToast('#t-toast', `点击了${data.name}`);
  }
});
