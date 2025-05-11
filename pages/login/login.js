import request from '~/api/request';

Page({
  onGetPhoneNumber(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      // 获取到微信手机号code后发送给后端
      request('/login/wxPhoneLogin', 'post', { code: e.detail.code }).then(res => {
        if (res.success) {
          wx.setStorageSync('access_token', res.data.token);
          wx.switchTab({ url: `/pages/my/index` });
        } else {
          wx.showToast({ title: '登录失败', icon: 'none' });
        }
      }).catch(err => {
        wx.showToast({ title: '登录异常', icon: 'none' });
        console.error('登录异常', err);
      });
    } else {
      wx.showToast({ title: '获取手机号失败', icon: 'none' });
    }
  }
});
