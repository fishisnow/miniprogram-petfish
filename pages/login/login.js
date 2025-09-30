import request from '~/api/request';

Page({
  data: {
    showPrivacy: false,
    privacyContractName: '《用户隐私保护指引》',
  },

  onLoad() {
    // 检查是否需要显示隐私协议
    this.checkPrivacyStatus();
  },

  // 检查隐私授权状态
  checkPrivacyStatus() {
    if (wx.getPrivacySetting) {
      wx.getPrivacySetting({
        success: (res) => {
          console.log('登录页-隐私授权状态:', res);
          if (res.needAuthorization) {
            console.log('需要用户授权隐私协议');
            this.setData({ 
              privacyContractName: res.privacyContractName || '《用户隐私保护指引》'
            });
            // 注意：不在这里显示弹窗，由系统在用户点击获取手机号时自动触发
          } else {
            console.log('用户已授权或不需要授权');
          }
        },
        fail: (err) => {
          console.error('获取隐私设置失败:', err);
        }
      });
    }
  },

  // 处理手机号获取
  onGetPhoneNumber(e) {
    console.log('获取手机号回调:', e.detail);
    
    // 用户拒绝授权
    if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
      wx.showToast({ 
        title: '需要授权手机号才能登录', 
        icon: 'none' 
      });
      return;
    }
    
    // 用户取消隐私协议
    if (e.detail.errMsg.includes('privacy')) {
      console.log('用户未同意隐私协议');
      wx.showModal({
        title: '提示',
        content: '需要同意隐私协议才能使用该功能',
        showCancel: false,
      });
      return;
    }
    
    // 获取成功
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      const code = e.detail.code;
      
      if (!code) {
        wx.showToast({ 
          title: '获取手机号失败，请重试', 
          icon: 'none' 
        });
        return;
      }

      // 显示加载提示
      wx.showLoading({
        title: '登录中...',
        mask: true,
      });

      // 获取到微信手机号code后发送给后端
      request('/login/wxPhoneLogin', 'post', { code })
        .then(res => {
          wx.hideLoading();
          
          if (res.success) {
            wx.setStorageSync('access_token', res.data.token);
            wx.showToast({
              title: '登录成功',
              icon: 'success',
            });
            
            // 延迟跳转，让用户看到成功提示
            setTimeout(() => {
              wx.switchTab({ url: `/pages/my/index` });
            }, 1500);
          } else {
            wx.showToast({ 
              title: res.message || '登录失败', 
              icon: 'none' 
            });
          }
        })
        .catch(err => {
          wx.hideLoading();
          wx.showToast({ 
            title: '登录异常，请重试', 
            icon: 'none' 
          });
          console.error('登录异常:', err);
        });
    } else {
      // 其他错误情况
      wx.showToast({ 
        title: '获取手机号失败', 
        icon: 'none' 
      });
    }
  },

  // 同意隐私协议（如果需要手动触发）
  handleAgreePrivacy() {
    if (wx.requirePrivacyAuthorize) {
      wx.requirePrivacyAuthorize({
        success: () => {
          console.log('隐私授权成功');
          this.setData({ showPrivacy: false });
          wx.showToast({
            title: '授权成功，请继续登录',
            icon: 'success',
          });
        },
        fail: (err) => {
          console.error('隐私授权失败:', err);
          wx.showToast({
            title: '需要同意协议才能使用',
            icon: 'none',
          });
        },
      });
    }
  },

  // 拒绝隐私协议
  handleDisagreePrivacy() {
    wx.showModal({
      title: '提示',
      content: '需要同意隐私协议才能使用该功能',
      showCancel: false,
      confirmText: '我知道了',
    });
  },
});
