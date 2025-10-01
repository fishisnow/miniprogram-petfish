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
    // 暂时注释掉登录验证逻辑，因为个人开发者账号无法使用手机号登录
    // 收藏和测试结果都存储在本地，无需登录
    // const Token = wx.getStorageSync('access_token');
    // if (Token) {
    //   this.setData({
    //     isLoad: true,
    //   });
    // }
  },

  // 暂时注释掉登录入口，个人开发者账号无法使用手机号快速验证功能
  // onLogin(e) {
  //   wx.navigateTo({
  //     url: '/pages/login/login',
  //   });
  // },

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
