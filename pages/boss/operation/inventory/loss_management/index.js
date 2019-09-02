// pages/boss/operation/inventory/loss_management/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bill: {
      // 状态 0：未回收，1：已回收
      list: [
        {
          storeName: '牛牛蛋糕店',//店名
          merchant: '供应商',//商家名
          state: 1,//状态
          code: '1102 2256 0300',//标记码
          date: '03月31日 12:59' //时间
        },
        {
          storeName: '牛牛蛋糕店',//店名
          merchant: '合作商',//商家名
          state: 1,//状态
          code: '1102 2256 0300',//标记码
          date: '03月31日 12:59' //时间
        },
        {
          storeName: '牛牛蛋糕店',//店名
          merchant: '合作商',//商家名
          state: 0,//状态
          code: '1102 2256 0300',//标记码
          date: '03月31日 12:59' //时间
        },
        {
          storeName: '牛牛蛋糕店',//店名
          merchant: '供应商',//商家名
          state: 1,//状态
          code: '1102 2256 0300',//标记码
          date: '03月31日 12:59' //时间
        },
      ]
    }
  },
  //跳转报损详情页
  bindToDetails(e){
    let storeName = e.currentTarget.dataset.storename
    wx.navigateTo({
      url: './details/index?storeName=' + storeName,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '报损管理'  //修改title
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})