import request from '~/api/request';

Page({
  data: {
    fishId: '',
    loading: true,
    detail: null,
    isFavorite: false,  // 添加收藏状态标记
    currentImageIndex: 0  // 添加当前图片索引
  },
  
  onLoad(options) {
    console.log('详情页接收参数:', options);
    const { id } = options;
    if (id) {
      this.setData({ fishId: id });
      this.fetchFishDetail(id);
      this.checkFavoriteStatus(id);  // 检查收藏状态
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
  
  // 切换到上一张图片
  prevImage() {
    const { currentImageIndex, detail } = this.data;
    if (!detail || !detail.images || detail.images.length <= 1) return;
    
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : detail.images.length - 1;
    this.setData({ currentImageIndex: newIndex });
  },
  
  // 切换到下一张图片
  nextImage() {
    const { currentImageIndex, detail } = this.data;
    if (!detail || !detail.images || detail.images.length <= 1) return;
    
    const newIndex = currentImageIndex < detail.images.length - 1 ? currentImageIndex + 1 : 0;
    this.setData({ currentImageIndex: newIndex });
  },
  
  // 直接切换到指定图片
  changeImage(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ currentImageIndex: index });
  },
  
  // 检查当前鱼是否已收藏
  checkFavoriteStatus(fishId) {
    const favorites = wx.getStorageSync('fish_favorites') || [];
    const isFavorite = favorites.some(item => item.id === fishId);
    this.setData({ isFavorite });
  },
  
  // 切换收藏状态
  toggleFavorite() {
    const { fishId, isFavorite } = this.data;
    let favorites = wx.getStorageSync('fish_favorites') || [];
    
    if (isFavorite) {
      // 取消收藏
      favorites = favorites.filter(item => item.id !== fishId);
      wx.showToast({
        title: '已取消收藏',
        icon: 'none'
      });
    } else {
      // 添加收藏
      // 如果已经有相同ID的收藏项，先移除
      favorites = favorites.filter(item => item.id !== fishId);
      
      // 构建收藏数据对象，只保存ID
      const favoriteItem = {
        id: fishId
      };
      
      // 打印收藏项信息
      console.log('正在添加收藏项:', favoriteItem);
      
      // 添加到收藏列表
      favorites.push(favoriteItem);
      
      wx.showToast({
        title: '收藏成功',
        icon: 'success'
      });
    }
    
    // 保存到本地存储并更新状态
    wx.setStorageSync('fish_favorites', favorites);
    this.setData({ isFavorite: !isFavorite });
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
  
  // 图片加载错误处理
  imageLoadError(e) {
    const index = e.currentTarget.dataset.index;
    console.log('图片加载错误:', index);
    
    // 获取当前detail数据
    const detail = { ...this.data.detail };
    if (detail && detail.images && detail.images.length > 0) {
      // 提取鱼名
      const fishName = detail.name || '';
      
      // 首先尝试加载本地图片，如果有匹配的鱼类名称
      if (fishName) {
        // 使用随机图服务作为最后备用
        const updatedImages = [...detail.images];
        updatedImages[index] = 'https://picsum.photos/400/300?fish=' + encodeURIComponent(fishName);
        
        // 更新图片数组
        detail.images = updatedImages;
        detail.fullPathImages = [...updatedImages];
        this.setData({ detail });
      }
    }
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
        // 增加日志，专门打印标签信息
        console.log('鱼类标签信息:', fishData.tags);
        
        // 确保fish的标签数据存在
        if (!fishData.tags || (Array.isArray(fishData.tags) && fishData.tags.length === 0)) {
          fishData.tags = ['进阶', '群游性', '展示型'];
          console.log('使用默认标签:', fishData.tags);
        } else if (!Array.isArray(fishData.tags)) {
          fishData.tags = [fishData.tags];
          console.log('将单个标签转换为数组:', fishData.tags);
        }
        
        // 处理图片路径，确保完整性
        if (fishData.images && fishData.images.length > 0) {
          fishData.images = fishData.images.map(img => {
            // 处理URL编码问题
            if (img && img.startsWith('http')) {
              // 确保URL编码正确，避免中文字符问题
              try {
                // 尝试处理特殊字符
                if (img.includes('%')) {
                  // 已编码的URL，直接返回
                  return img;
                } else {
                  // 尝试编码URL中的中文字符
                  const parts = img.split('/');
                  const lastPart = parts[parts.length - 1];
                  if (/[\u4e00-\u9fa5]/.test(lastPart)) {
                    // 如果包含中文，对最后部分进行编码
                    parts[parts.length - 1] = encodeURIComponent(lastPart);
                    return parts.join('/');
                  }
                }
                return img;
              } catch (e) {
                console.error('URL处理错误:', e);
                return img;
              }
            }
            // 如果是相对路径，转换为完整路径
            else if (img && !img.startsWith('/')) {
              return `/${img}`;
            }
            return img;
          });
          
          // 预览用的完整路径图片使用原始URL
          fishData.fullPathImages = [...fishData.images];
        } else {
          // 如果没有图片，设置默认图片
          fishData.images = ['https://picsum.photos/400/300'];
          fishData.fullPathImages = [...fishData.images];
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
      console.log('预览图片:', url);
      console.log('图片列表:', detail.images);
      
      // 直接使用图片URL数组
      wx.previewImage({
        current: url,
        urls: detail.fullPathImages || detail.images
      });
    }
  }
}); 