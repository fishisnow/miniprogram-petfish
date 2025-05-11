// app.js
import config from './config';
import Mock from './data/index';
import createBus from './utils/eventBus';

if (config.isMock) {
  Mock();
}

App({
  onLaunch() {
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
  globalData: {
    userInfo: null,
    socket: null, // SocketTask 对象
  },

  /** 全局事件总线 */
  eventBus: createBus(),
});
