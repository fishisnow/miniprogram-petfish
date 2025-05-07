import Message from 'tdesign-miniprogram/message/index';
import request from '~/api/request';

// 获取应用实例
// const app = getApp()

Page({
  data: {
    enable: false,
    activeTab: 'recommend', // 当前激活的标签
    cardInfo: [],
    focusCardInfo: [], // 最受欢迎的鱼类列表
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),
    cards: [],
    loading: true,
    // 分页加载相关参数
    pageSize: 10,         // 每页加载数量
    currentPage: 1,       // 当前页码
    totalPages: 1,        // 总页数
    isLoadingMore: false, // 是否正在加载更多
    hasMoreData: true,    // 是否还有更多数据
    popularHasMoreData: false
  },
  // 生命周期
  async onReady() {
    await this.initData();
  },

  // 初始化数据
  async initData() {
    // 如果已经在加载中，不再重复触发
    if (this.data.isLoadingMore) {
      return;
    }
    
    // 设置加载状态，清空现有数据
    this.setData({
      loading: true,
      cardInfo: [],
      focusCardInfo: [],
      currentPage: 1,
      hasMoreData: true
    });

    try {
      // 获取最受欢迎的鱼类数据和第一页数据
      const [popularRes, success] = await Promise.all([
        request('/home/popular'),
        this.loadCardsByPage(1)
      ]);
      
      // 如果获取到了最受欢迎的鱼类数据
      if (popularRes && popularRes.code === 200) {
        const popularCardInfo = popularRes.data.map(card => ({
          ...card,
          fishId: card.id
        }));
        
        this.setData({
          focusCardInfo: popularCardInfo,
          popularHasMoreData: false // 暂时认为只有一页
        });
      } else {
        // 如果没有获取到最受欢迎的鱼类数据，就显示全部中的前几个
        this.setData({
          focusCardInfo: this.data.cardInfo.slice(0, 3),
          popularHasMoreData: false
        });
      }
      
      // 无论如何，都需要关闭loading状态
      this.setData({
        loading: false,
        enable: false
      });
    } catch (error) {
      console.error('初始化数据出错:', error);
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      });
      this.setData({ 
        loading: false,
        enable: false 
      });
    }
  },

  // 每次显示页面时都重新加载数据
  onShow() {
    // 避免重复加载
    if (this.data.cardInfo.length === 0) {
      this.initData();
    }
  },

  // 监听标签切换事件
  onTabChange(e) {
    const { value } = e.detail;
    
    this.setData({
      activeTab: value
    });
    
    // 如果是切换到"最受欢迎"标签，而且还没有加载数据，则加载数据
    if (value === 'follow' && this.data.focusCardInfo.length === 0) {
      this.initData();
    }
  },

  // 加载指定页码的鱼类数据
  async loadCardsByPage(page) {
    // 防止重复加载，但第一页初始加载时允许
    if (this.data.isLoadingMore && page > 1) {
      return false;
    }
    
    // 加载更多时显示底部加载状态
    if (page > 1) {
      this.setData({ 
        isLoadingMore: true
      });
    }
    
    try {
      console.log('开始请求页码:', page);
      // 兼容原有API，先尝试不带分页参数请求
      const cardRes = await request('/home/cards');
      console.log('请求结果:', cardRes);
      
      if (cardRes && cardRes.code === 200) {
        // 处理返回数据
        let newCards = [];
        let total = 0;
        
        // 适配不同的返回数据结构
        if (Array.isArray(cardRes.data)) {
          // 原始API返回的是数组，我们需要手动分页
          const allCards = cardRes.data.map(card => ({
            ...card,
            fishId: card.id
          }));
          
          total = allCards.length;
          const start = (page - 1) * this.data.pageSize;
          const end = page * this.data.pageSize;
          newCards = allCards.slice(start, end);
        } else if (cardRes.data && cardRes.data.list) {
          // 新的分页API返回的是对象，包含list和total
          newCards = cardRes.data.list.map(card => ({
            ...card,
            fishId: card.id
          }));
          total = cardRes.data.total || 0;
        } else {
          // 兜底处理，直接使用返回的数据
          newCards = Array.isArray(cardRes.data) ? cardRes.data : [];
          total = newCards.length;
          newCards = newCards.map(card => ({
            ...card,
            fishId: card.id
          }));
        }
        
        // 计算总页数
        const totalPages = Math.ceil(total / this.data.pageSize) || 1;
        
        // 判断是否还有更多数据
        const hasMoreData = page < totalPages;
        
        console.log('处理后数据:', {
          page,
          newCards: newCards.length,
          totalPages,
          hasMoreData
        });
        
        if (page === 1) {
          // 第一页，直接设置数据
          this.setData({
            cardInfo: newCards,
            currentPage: page,
            totalPages,
            hasMoreData
          });
        } else {
          // 非第一页，追加数据
          this.setData({
            cardInfo: [...this.data.cardInfo, ...newCards],
            currentPage: page,
            totalPages,
            hasMoreData
          });
        }
        
        return true;
      } else {
        console.error('获取数据失败:', cardRes);
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        });
        return false;
      }
    } catch (error) {
      console.error('加载数据出错:', error);
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      });
      return false;
    } finally {
      // 重置加载状态
      if (page > 1) {
        this.setData({ 
          isLoadingMore: false
        });
      }
    }
  },
  // 监听页面上拉触底事件
  onReachBottom() {
    console.log('触发页面触底事件');
    this.loadMoreData();
  },
  // 监听页面滚动事件
  onPageScroll(e) {
    // 获取页面高度信息
    wx.createSelectorQuery().selectViewport().scrollOffset(res => {
      const scrollTop = res.scrollTop;
      // 使用新的API替代已弃用的wx.getSystemInfoSync
      const windowInfo = wx.getWindowInfo();
      const windowHeight = windowInfo.windowHeight;
      
      wx.createSelectorQuery().select('.home-container').boundingClientRect(rect => {
        if (!rect) return;
        
        // 判断是否滚动到底部附近 (距离底部100px以内)
        const isNearBottom = (scrollTop + windowHeight + 100 >= rect.height + rect.top);
        
        if (isNearBottom) {
          console.log('接近底部，尝试加载更多');
          this.loadMoreData();
        }
      }).exec();
    }).exec();
  },
  // 加载更多数据
  loadMoreData() {
    // 如果正在刷新整个列表或者正在加载更多或者还没有初始数据，就不再触发
    if (this.data.enable || this.data.isLoadingMore || this.data.loading || !this.data.cardInfo || this.data.cardInfo.length === 0) {
      console.log('加载条件不满足，不触发加载更多:', {
        enable: this.data.enable,
        isLoadingMore: this.data.isLoadingMore,
        loading: this.data.loading,
        hasCardInfo: this.data.cardInfo && this.data.cardInfo.length > 0
      });
      return;
    }
    
    // 根据当前激活的标签决定加载哪种数据
    if (this.data.activeTab === 'recommend') {
      if (this.data.hasMoreData) {
        console.log('加载更多数据，当前页码:', this.data.currentPage);
        const nextPage = this.data.currentPage + 1;
        this.loadCardsByPage(nextPage);
      } else {
        console.log('没有更多数据了');
      }
    } else if (this.data.activeTab === 'follow') {
      // 如果是"最受欢迎"标签，且还有更多数据
      if (this.data.popularHasMoreData) {
        // 这里可以添加加载更多最受欢迎数据的逻辑
        console.log('加载更多最受欢迎数据');
        // 暂时没有实现
      } else {
        console.log('没有更多最受欢迎数据了');
      }
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
      if (option.oper === 'save') {
        content = '保存成功';
      }
      if (content) {
      this.showOperMsg(content);
      }
    }
  },
  onRefresh() {
    this.refresh();
  },
  async refresh() {
    // 如果已经在加载中，防止重复触发
    if (this.data.isLoadingMore) {
      this.setData({
        enable: false
      });
      return;
    }
    
    // 设置下拉刷新状态，但不清除现有数据，避免闪烁
    this.setData({
      enable: true
    });
    
    try {
      // 重新初始化所有数据
      await this.initData();
    } catch (error) {
      console.error('刷新失败:', error);
      wx.showToast({
        title: '刷新失败',
        icon: 'none'
      });
    } finally {
      // 确保下拉刷新状态被关闭
      setTimeout(() => {
        this.setData({
          enable: false
        });
      }, 500); // 添加短暂延时，确保刷新动画流畅
    }
  },
  showOperMsg(content) {
    Message.success({
      context: this,
      offset: [120, 32],
      duration: 4000,
      content,
    });
  }
});
