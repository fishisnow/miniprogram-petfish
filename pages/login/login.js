import request from '~/api/request';

Page({
  data: {
    phoneNumber: '',
    verifyCode: '',
    isPhoneNumber: false,
    sendCodeCount: 0,
    canSubmit: false,
  },

  timer: null,

  onPhoneInput(e) {
    const isPhoneNumber = /^[1][3,4,5,7,8,9][0-9]{9}$/.test(e.detail.value);
    this.setData({
      phoneNumber: e.detail.value,
      isPhoneNumber,
    });
    this.updateCanSubmit();
  },

  onVerifyCodeInput(e) {
    this.setData({ verifyCode: e.detail.value });
    this.updateCanSubmit();
  },

  updateCanSubmit() {
    this.setData({
      canSubmit: this.data.isPhoneNumber && this.data.verifyCode.length > 0
    });
  },

  sendCode() {
    if (!this.data.isPhoneNumber || this.data.sendCodeCount > 0) return;
    request('/login/getSendMessage', 'get').then(() => {
      this.setData({ sendCodeCount: 60 });
      this.timer = setInterval(() => {
        if (this.data.sendCodeCount <= 0) {
          clearInterval(this.timer);
        } else {
          this.setData({ sendCodeCount: this.data.sendCodeCount - 1 });
        }
      }, 1000);
    });
  },

  async login() {
    if (!this.data.canSubmit) return;
    const res = await request('/login/postCodeVerify', 'get', { code: this.data.verifyCode });
      if (res.success) {
        await wx.setStorageSync('access_token', res.data.token);
      wx.switchTab({ url: `/pages/my/index` });
      }
  },

  wxLogin() {
    // 微信一键登录逻辑（需根据实际小程序配置实现）
    wx.login({
      success: (res) => {
        // 这里应调用后端接口进行微信登录
        // 示例：request('/login/wxLogin', 'post', { code: res.code })
        // 登录成功后同样跳转
      }
    });
  },

  onUnload() {
    if (this.timer) clearInterval(this.timer);
  },
});
