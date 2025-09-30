Component({
  properties: {},
  data: {
    show: false,
    privacyContractName: '',
    resolvePrivacyAuthorization: null,
  },
  lifetimes: {
    attached() {
      // 检查是否需要显示隐私协议
      this.checkPrivacyAuthorization();

      // 监听隐私协议需要展示（新版API）
      if (wx.onNeedPrivacyAuthorization) {
        wx.onNeedPrivacyAuthorization((resolve) => {
          console.log('触发隐私授权需求');
          this.setData({
            show: true,
            resolvePrivacyAuthorization: resolve,
          });
        });
      }

      // 获取隐私协议名称
      if (wx.getPrivacySetting) {
        wx.getPrivacySetting({
          success: (res) => {
            console.log('隐私协议配置:', res);
            const privacyContractName = res.privacyContractName || '《用户隐私保护指引》';
            this.setData({ privacyContractName });
            
            // 如果需要授权，显示弹窗
            if (res.needAuthorization) {
              console.log('需要用户授权隐私协议');
              // 注意：不在这里直接显示弹窗，而是等待用户触发隐私接口时由系统自动触发
            }
          },
          fail: (err) => {
            console.error('获取隐私设置失败:', err);
          },
        });
      }
    },
  },
  methods: {
    // 检查隐私授权状态
    checkPrivacyAuthorization() {
      if (wx.getPrivacySetting) {
        wx.getPrivacySetting({
          success: (res) => {
            console.log('隐私授权状态检查:', res);
            if (res.needAuthorization) {
              // 需要授权，但不立即显示弹窗
              // 等待用户操作触发
              console.log('用户需要同意隐私协议');
            } else {
              console.log('用户已同意隐私协议或不需要授权');
            }
          },
        });
      }
    },

    // 用户同意隐私协议（使用官方推荐的方式）
    handleAgree() {
      console.log('用户点击同意隐私协议');
      
      // 方式1: 使用 resolve 回调（适用于 onNeedPrivacyAuthorization）
      if (this.data.resolvePrivacyAuthorization) {
        this.data.resolvePrivacyAuthorization({ 
          event: 'agree',
          buttonId: 'agree-btn' 
        });
        this.setData({ 
          show: false,
          resolvePrivacyAuthorization: null 
        });
      } else {
        // 方式2: 使用 requirePrivacyAuthorize API
        if (wx.requirePrivacyAuthorize) {
          wx.requirePrivacyAuthorize({
            success: () => {
              console.log('隐私授权成功');
              this.setData({ show: false });
              wx.setStorageSync('privacy_agreed', true);
              wx.showToast({
                title: '授权成功',
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
        } else {
          // 兜底：直接关闭弹窗
          this.setData({ show: false });
          wx.setStorageSync('privacy_agreed', true);
        }
      }
    },

    // 用户拒绝隐私协议
    handleDisagree() {
      console.log('用户拒绝隐私协议');
      
      // 调用resolve表示用户拒绝
      if (this.data.resolvePrivacyAuthorization) {
        this.data.resolvePrivacyAuthorization({ event: 'disagree' });
        this.setData({ 
          show: false,
          resolvePrivacyAuthorization: null 
        });
      } else {
        this.setData({ show: false });
      }
      
      // 提示用户
      wx.showModal({
        title: '提示',
        content: '需要同意隐私协议才能使用相关功能',
        showCancel: false,
        confirmText: '我知道了',
      });
    },

    // 打开隐私协议详情
    openPrivacyContract() {
      if (wx.openPrivacyContract) {
        wx.openPrivacyContract({
          success: () => {
            console.log('打开隐私协议成功');
          },
          fail: (err) => {
            console.error('打开隐私协议失败:', err);
            wx.showToast({
              title: '打开协议失败',
              icon: 'none',
            });
          },
        });
      } else {
        wx.showToast({
          title: '当前版本不支持',
          icon: 'none',
        });
      }
    },
  },
});

