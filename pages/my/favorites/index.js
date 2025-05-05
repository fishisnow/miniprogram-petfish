import request from '~/api/request';

Page({
  data: {
    favoritesList: [],
    filteredList: [],
    searchValue: '',
    loading: true  // 添加加载状态
  },

  onLoad() {
    this.loadFavorites();
  },

  onShow() {
    // 每次页面显示时都重新加载，保证数据最新
    this.setData({ loading: true });  // 重新显示loading状态
    this.loadFavorites();
  },

  // 从本地存储加载收藏数据
  loadFavorites() {
    const favorites = wx.getStorageSync('fish_favorites') || [];
    
    if (favorites.length === 0) {
      this.setData({ 
        favoritesList: [],
        filteredList: [],
        loading: false  // 设置加载完成
      });
      return;
    }
    
    // 始终从服务器获取最新的鱼类详细信息
    Promise.all(
      favorites.map(item => {
        // 根据ID获取详细信息
        return request(`/fish/detail/${item.id}`).then(res => {
          if (res && res.code === 200) {
            const fishData = res.data;
            return {
              id: item.id,
              fishId: item.id, // 确保fishId属性存在，用于点击跳转
              name: fishData.name,
              url: fishData.images && fishData.images.length > 0 ? 
                  (fishData.images[0].startsWith('http') ? fishData.images[0] : fishData.images[0]) : '',
              tags: fishData.tags || []  // 直接使用服务器返回的标签，如果不存在则使用空数组
            };
          }
          // 如果请求失败，返回带有基本信息的对象
          return { 
            id: item.id,
            fishId: item.id,
            name: '未知鱼类',
            tags: []
          };
        }).catch(() => {
          // 出错时也返回带有基本信息的对象
          return { 
            id: item.id,
            fishId: item.id,
            name: '未知鱼类',
            tags: []
          };
        });
      })
    ).then(detailedList => {
      this.setData({
        favoritesList: detailedList,
        filteredList: detailedList,
        loading: false  // 设置加载完成
      });
      
      // 打印收藏列表信息
      console.log('收藏列表:', detailedList);
    }).catch(error => {
      console.error('加载收藏列表出错:', error);
      this.setData({
        loading: false  // 即使出错也要结束加载状态
      });
    });
  },

  // 处理搜索输入变化
  onSearchChange(e) {
    const searchValue = e.detail.value || '';
    this.setData({
      searchValue
    });
    this.filterFavorites(searchValue);
  },

  // 处理搜索提交
  onSearchSubmit(e) {
    const searchValue = e.detail.value || '';
    this.filterFavorites(searchValue);
  },

  // 根据搜索关键词过滤收藏列表
  filterFavorites(keyword) {
    if (!keyword) {
      this.setData({
        filteredList: this.data.favoritesList
      });
      return;
    }

    const filtered = this.data.favoritesList.filter(item => {
      // 根据名称和标签进行搜索
      const nameMatch = item.name && item.name.toLowerCase().includes(keyword.toLowerCase());
      
      // 搜索标签
      const tagMatch = item.tags && item.tags.some(tag => 
        tag.toLowerCase().includes(keyword.toLowerCase())
      );
      
      return nameMatch || tagMatch;
    });
    
    this.setData({
      filteredList: filtered
    });
  },

  // 点击卡片跳转到详情页
  onClick(e) {
    const { fishId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/fish/detail/index?id=${fishId}`
    });
  },

  // 点击"去探索"按钮
  goExplore() {
    wx.switchTab({
      url: '/pages/home/index'
    });
  }
}); 