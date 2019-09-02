// pages/employee/loss/after_sale/details/scan/index.js
import QRCode from '../../../../../../utils/qrcode.js'
let qrcode
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '扫一扫-确认售后出货'  //修改title
    })
    qrcode = new QRCode('canvasQrcode', {
      text: "http://www.demodashi.com/demo/13994.html",
      width: 180,
      height: 180,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: 1,
    });
  },

  tapHandler: function (e) {
    qrcode.makeCode(e.target.dataset.code);  //用元素对应的code更新二维码
  },
  //跳转条码信息
  bindToBarCode() {
    wx.navigateTo({
      url: './details/index',
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