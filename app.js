// app.js
import config from './config';
import Mock from './data/index';
import createBus from './utils/eventBus';

if (config.isMock) {
  Mock();
}

App({
  onLaunch() {
    // 初始化隐私授权
    this.initPrivacy();
    
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate((res) => {
      // console.log(res.hasUpdate)
    });

    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        },
      });
    });

    // 移除对不存在的 connect 方法的调用
    // this.connect();
  },

  // 初始化隐私授权
  initPrivacy() {
    if (wx.getPrivacySetting) {
      wx.getPrivacySetting({
        success: (res) => {
          console.log('隐私协议状态:', res);
          // needAuthorization 表示用户是否需要授权
          // privacyContractName 是隐私协议名称
          if (res.needAuthorization) {
            console.log('需要用户授权隐私协议');
          } else {
            console.log('用户已授权或不需要授权');
          }
        },
        fail: (err) => {
          console.error('获取隐私设置失败:', err);
        },
      });
    }
  },
  globalData: {
    userInfo: null,
    socket: null, // SocketTask 对象
  },

  /** 全局事件总线 */
  eventBus: createBus(),
});
