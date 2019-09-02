// pages/boss/operation/inventory/list/details/index.js
let app = getApp();
import util from '../../../../../../utils/util.js'
import urlList from '../../../../../../api/api.js'
let userData = wx.getStorageSync('accountLogin')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleName:'',
    isShow: false,
    tableTrListHeight: 'auto',
    marker:'',//标记
    categoryId:'',//品种ID
    noData: false,
    total: 0,
    pageNum: 1,
    specificationId:'',
    list:[
      
    ]
  },
  //table 内容可滚动区域计算
  tableTrScroll() {
    let winHeight = 0, sumResHeight = 0;
    app.windowScrollHeight((height) => { winHeight = height })
    app.getQueryNodes(['.listHead', '.tableHead', '.loadingBox'], (res) => {
      for (let i = 0, len = res.length; i < len; i++) {
        sumResHeight += res[i].height
      }
      this.setData({
        tableTrListHeight: (winHeight - sumResHeight - 2) + 'px'
      })
    })
  },
  //获取详情列表
  getFindBySpecification(obj){
    util.ajax({
      loadMore: obj.loadMore,
      total: this.data.total,
      loadedNum: this.data.list.length,
      pageNum: this.data.pageNum,
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.inventoryFindBySpecification,
      //  + '?shopId=' + userData.user.shopId + '&companyId=' + userData.user.companyId + '&categoryId=' + obj.categoryId
      data: {
        // "companyId": userData.user.companyId,
        // "shopId": userData.user.shopId,
        "specificationId": this.data.specificationId,
        // "categoryId": obj.categoryId,
        // "stockId": obj.stockId,
        // "marker": obj.marker,
        "current": 1,
        // "mode": "string",
        // "numerical": "string",
        // "pages": 0,
        // "programId": obj.programId,
        // "quantity": "string",
        "size": 20,
        // "total": 0,
        // "warn": "string",
        // "weightMax": "string",
        // "weightMin": "string"
      },
      method: 'post',
      success: (res) => {
        console.log(res)
        let data = res.data, goodsList = data.data.goodsList, list = goodsList.list, dataList = this.data.list
        if (list) {
          for(let i = 0, len = list.length; i < len; i++){
            let item = list[i]
            dataList.push(item)
          }
          this.setData({
            list: dataList,
            pageNum: this.data.pageNum + 1,
            total: goodsList.total
          })
          // obj.fn(res)
        }else{
          this.setData({
            noData: true
          })
        }
      },
    })
  },
  //列表数据Loading
  refreshListData() {
    this.getFindBySpecification({
      loadMore: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      titleName: options.name,
      categoryId: options.categoryId,
      marker: options.marker,
      specificationId: options.specificationId,
    })
    wx.setNavigationBarTitle({
      title: this.data.titleName + '库存-详情列表'  //修改title
    })
    this.getFindBySpecification({
      fn: () => {

      }
    })
    this.tableTrScroll()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})