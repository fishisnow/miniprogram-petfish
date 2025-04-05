import Message from 'tdesign-miniprogram/message/index';
import request from '~/api/request';

// 获取应用实例
// const app = getApp()

Page({
  data: {
    enable: false,
    cardInfo: [],
    focusCardInfo: [], // 最受欢迎的鱼类列表
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
    try {
      // 获取所有鱼类数据
      const cardRes = await request('/home/cards');
      
      // 获取最受欢迎的鱼类数据
      const popularRes = await request('/home/popular');
      
      if (cardRes && cardRes.code === 200) {
        const cardInfo = cardRes.data.map(card => ({
          ...card,
          fishId: card.id
        }));
        
        // 如果获取到了最受欢迎的鱼类数据
        if (popularRes && popularRes.code === 200) {
          const popularCardInfo = popularRes.data.map(card => ({
            ...card,
            fishId: card.id
          }));
          
          this.setData({
            cardInfo,
            focusCardInfo: popularCardInfo,
            loading: false
          });
        } else {
          // 如果没有获取到最受欢迎的鱼类数据，就显示全部中的前几个
          this.setData({
            cardInfo,
            focusCardInfo: cardInfo.slice(0, 3),
            loading: false
          });
        }
      } else {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        });
      }
    } catch (error) {
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      });
    }
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
  },
  onRefresh() {
    this.refresh();
  },
  async refresh() {
    this.setData({
      enable: true,
    });
    
    try {
      // 获取所有鱼类数据
      const cardRes = await request('/home/cards');
      
      // 获取最受欢迎的鱼类数据
      const popularRes = await request('/home/popular');
      
      if (cardRes && cardRes.code === 200) {
        const cardInfo = cardRes.data.map(card => ({
          ...card,
          fishId: card.id
        }));
        
        // 更新最受欢迎鱼类数据
        if (popularRes && popularRes.code === 200) {
          const popularCardInfo = popularRes.data.map(card => ({
            ...card,
            fishId: card.id
          }));
          
          this.setData({
            cardInfo,
            focusCardInfo: popularCardInfo,
            enable: false
          });
        } else {
          this.setData({
            cardInfo,
            enable: false
          });
        }
      } else {
        this.setData({
          enable: false
        });
        wx.showToast({
          title: '刷新失败',
          icon: 'none'
        });
      }
    } catch (error) {
      this.setData({
        enable: false
      });
      wx.showToast({
        title: '刷新失败',
        icon: 'none'
      });
    }
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
  }
});
