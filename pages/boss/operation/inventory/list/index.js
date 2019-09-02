// pages/boss/operation/inventory/list/index.js
import util from '../../../../../utils/util.js'
import urlList from '../../../../../api/api.js'
let userData = wx.getStorageSync('accountLogin')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleName:'',
    categoryId:'',//品种ID
    noData:false,
    total: 0,
    pageNum: 1,
    list:[
      // { sign: '7', section: '30~32', way: '包', surplus:'675', unit:'箱', id: '1' },
      // { sign: '7-', section: '30~34', way: '包', surplus: '675', unit: '箱', id: '2' },
      // { sign: '48', section: '30~32', way: '包', surplus: '675', unit: '箱', id: '3' },
      // { sign: '实重', section: '30~32', way: '包', surplus: '675', unit: '箱', id: '4' },
    ],
  },
  //跳转列表详情
  bindToListDetails(e){
    let id = e.currentTarget.dataset.id,
      pid = e.currentTarget.dataset.pid,
      marker = e.currentTarget.dataset.sign,
      stockId = e.currentTarget.dataset.stockid
    wx.navigateTo({
      url: './details/index?name=' + this.data.titleName + '&specificationId=' + id + '&categoryId=' + this.data.categoryId + '&programId=' + pid + '&marker=' + marker + '&stockId=' + stockId,
    })
  },
  //获取品种列表数据
  getCategoryList(obj){
    util.ajax({
      loadMore: obj.loadMore,
      total: this.data.total,
      loadedNum: this.data.list.length,
      pageNum: this.data.pageNum,
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.inventoryListPage,
      //  + '?shopId=' + userData.user.shopId + '&companyId=' + userData.user.companyId + '&categoryId=' + obj.categoryId
      data: {
        "categoryId": this.data.categoryId,
        // "companyId": userData.user.companyId,
        "current": 1,
        // "marker": "string",
        // "mode": "string",
        // "numerical": "string",
        // "pages": 0,
        // "programId": "string",
        // "quantity": "string",
        // "shopId": userData.user.shopId,
        "size": 20,
        // "specificationId": "string",
        // "stockId": "string",
        // "total": 0,
        // "warn": "string",
        // "weightMax": "string",
        // "weightMin": "string"
      },
      method: 'post',
      success: (res) => {
        console.log(res)
        let data = res.data, list = data.data.records
        if (list.length > 0) {
          this.setData({
            list,
            pageNum: this.data.pageNum + 1
          })
          // obj.fn(res)
        }else{
          this.setData({
            noData:true
          })
        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      titleName: options.name,
      categoryId: options.categoryId
      // titleName:''
    })
    wx.setNavigationBarTitle({
      title: this.data.titleName + '库存'  //修改title
    })
    this.getCategoryList({
      fn: (res) => {

      }
    })
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
    this.getCategoryList({
      loadMore: true
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})