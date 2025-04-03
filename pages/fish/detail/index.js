import request from '~/api/request';

Page({
  data: {
    fishId: '',
    loading: true,
    detail: null
  },
  
  onLoad(options) {
    console.log('详情页接收参数:', options);
    const { id } = options;
    if (id) {
      this.setData({ fishId: id });
      this.fetchFishDetail(id);
    } else {
      console.error('缺少鱼类ID参数');
      wx.showToast({
        title: '缺少鱼类ID',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },
  
  // 添加返回按钮点击事件处理
  onBack() {
    wx.navigateBack({
      delta: 1,
      fail: (err) => {
        console.error('返回失败:', err);
        // 如果返回失败，尝试跳转到首页
        wx.switchTab({
          url: '/pages/home/index'
        });
      }
    });
  },
  
  async fetchFishDetail(id) {
    try {
      console.log('开始获取鱼类详情，ID:', id);
      const url = `/fish/detail/${id}`;
      console.log('请求URL:', url);
      
      const res = await request(url);
      console.log('鱼类详情响应:', res);
      
      // 处理响应数据，兼容不同的返回格式
      let fishData = null;
      if (res && res.code === 200) {
        fishData = res.data;
      } else if (res && res.data && res.data.code === 200) {
        // 兼容嵌套数据结构
        fishData = res.data.data;
      }
      
      if (fishData) {
        console.log('获取到鱼类详情数据:', fishData);
        
        // 处理图片路径，确保完整性
        if (fishData.images && fishData.images.length > 0) {
          fishData.images = fishData.images.map(img => 
            img.startsWith('http') ? img : img
          );
          
          // 准备预览用的完整路径图片
          const fullPathImages = fishData.images.map(img => 
            img.startsWith('http') ? img : `../../..${img}`
          );
          fishData.fullPathImages = fullPathImages;
        }
        
        this.setData({
          detail: fishData,
          loading: false
        }, () => {
          console.log('详情页数据已设置:', this.data.detail);
        });
      } else {
        console.error('鱼类详情数据无效:', res);
        console.error('响应格式:', typeof res, Array.isArray(res) ? '是数组' : '不是数组');
        if (typeof res === 'object') {
          console.error('响应对象的键:', Object.keys(res));
        }
        
        wx.showToast({
          title: '鱼类信息获取失败',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    } catch (error) {
      console.error('请求鱼类详情发生错误:', error);
      console.error('错误类型:', error.name);
      console.error('错误消息:', error.message);
      console.error('错误栈:', error.stack);
      
      wx.showToast({
        title: '网络请求失败',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },
  
  // 图片预览功能
  previewImage(e) {
    const { url } = e.currentTarget.dataset;
    const { detail } = this.data;
    
    if (detail && detail.images && detail.images.length > 0) {
      // 使用处理后的完整路径图片进行预览
      const current = url.startsWith('http') ? url : `../../..${url}`;
      wx.previewImage({
        current,
        urls: detail.fullPathImages || detail.images.map(img => img.startsWith('http') ? img : `../../..${img}`)
      });
    }
  }
}); 