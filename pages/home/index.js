import Message from 'tdesign-miniprogram/message/index';
import request from '~/api/request';

// 获取应用实例
// const app = getApp()

Page({
  data: {
    enable: false,
    cardInfo: [],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),
    cards: [],
    loading: true
  },
  // 生命周期
  async onReady() {
    const cardRes = await request('/home/cards').then((res) => res.data);

    this.setData({
      cardInfo: cardRes.data,
      focusCardInfo: cardRes.data.slice(0, 3),
    });
  },
  onLoad(option) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
    if (option.oper) {
      let content = '';
      if (option.oper === 'release') {
        content = '发布成功';
      } else if (option.oper === 'save') {
        content = '保存成功';
      }
      this.showOperMsg(content);
    }
    this.getCards();
  },
  onRefresh() {
    this.refresh();
  },
  async refresh() {
    this.setData({
      enable: true,
    });
    
    const cardRes = await request('/home/cards').then((res) => res.data);

    setTimeout(() => {
      this.setData({
        enable: false,
        cardInfo: cardRes.data,
      });
    }, 1500);
  },
  showOperMsg(content) {
    Message.success({
      context: this,
      offset: [120, 32],
      duration: 4000,
      content,
    });
  },
  goRelease() {
    wx.navigateTo({
      url: '/pages/release/index',
    });
  },
  getCards() {
    wx.request({
      url: '/home/cards',
      success: ({ data }) => {
        this.setData({
          cards: data.data,
          loading: false
        });
      }
    });
  }
});
