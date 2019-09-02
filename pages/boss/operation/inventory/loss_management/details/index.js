// pages/boss/operation/inventory/loss_management/details/index.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeName:'',
    //报损回收
    recovery: {
      name: '红鸡蛋',//姓名
      signNO: '100033394440',//账单编号
      lossReason: '大部分鸡蛋已损坏,损坏时间预计在出货前。',//报损原因
      list:[
        { id: '1', sign: '8', weight: '41.3', date: '2019-04-21' },
        { id: '2', sign: '7-', weight: '41.3', date: '2019-04-22' },
        { id: '2', sign: '实重', weight: '41.3', date: '2019-04-22' },
      ]
    },
    //报损出货
    shipment:{
      name: '白鸡蛋',
      signNO: '100033394441',
      list:[
        { id: '1', sign: '8', weight: '41.3', date: '2019-04-21' },
        { id: '2', sign: '7-', weight: '41.3', date: '2019-04-22' },
        { id: '2', sign: '实重', weight: '41.3', date: '2019-04-22' },
      ]
    },
  },
  //跳转账单信息
  bindToBillDetails(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../../../bill/details/index?id=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      storeName: options.storeName
      // storeName: '牛牛蛋糕店'
    })
    wx.setNavigationBarTitle({
      title: this.data.storeName  //修改title
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