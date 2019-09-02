// pages/employee/loss/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lossList: [
      {
        text: '自损',
        icon: '../../../images/icon_self_destruction.png',
        link: './self_destruction/index',
        bgClass: 'bg_2f80d2',
      },
      {
        text: '售后',
        icon: '../../../images/icon_after_sale.png',
        link: './after_sale/index',
        bgClass: 'bg_67c239',
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '售后'  //修改title
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