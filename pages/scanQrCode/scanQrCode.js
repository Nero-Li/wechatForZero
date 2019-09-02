// pages/scanQrCode/scanQrCode.js
import util from '../../utils/util.js'
import urlList from '../../api/api.js'
// console.log(urlList.addunloaddetl)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 100,
    msg: '',
    qrCode: '',
    weight: 0,
    resData:{},
    times: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  // 调用扫码
  scanCode() {
    let that = this
    wx.scanCode({
      success: (res) => {
        that.setData({
          qrCode: res.result
        })
        
        that.onBLECharacteristicValueChange()
        that.shipmentGoods()
        console.log('datalist', that.data.qrCode)
      }
    })
  },
  // 向后台提交扫描到的数据
  shipmentGoods() {
    let that = this
    util.ajax({
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url:urlList.addunloaddetl,
      data:{
        // goodsCategoryId: '', // 品种主键
        // goodsNo: '', // 品种编码
        // id: '', // 卸货记录主键
        // mode: '', // 记重方式
        // programId: '', // 方案主键
        // shopId: '', // 店铺主键
        // supplierId: '', // 供应商主键
        // taskId: '', // 任务主键
        qrCode: that.data.qrCode, // id
        // qrCode:'b597f790fcf9c6f51 4f564fc2a8d4a46',//
        weight: that.data.weight, // 重量
      },
      success: (res) => {
        console.log(res)
        if (res.data.state === 1) {
          that.setData({
            msg: '',
            resData: res.data.data
          })
          setTimeout(() => {
            that.scanCode()
          },2000)
          this.onLoad()
        } else {
          that.setData({
            msg: res.data.message,
            resData: {}
          })
        }
      }
    })
  },
  // 和秤进行交互
  onBLECharacteristicValueChange() {
    let that = this
    // that.setData({
    //   weight: 10
    // })
    // return 
    wx.onBLECharacteristicValueChange(function (characteristic) {
      var buffer = characteristic.value;
      var dataview = new DataView(buffer);
      let unit8Arr = new Uint8Array(buffer);
      let weightVal = ''
      for (var i = 0; i < unit8Arr.length; i++) {
        weightVal += String.fromCharCode(dataview.getUint8(i));
      }
      console.log(weightVal)
      weightVal = (weightVal.split(',')[2].replace(/[^0-9]/ig, "") / 1000).toFixed(2)
      console.log(weightVal)
      that.setData({
        weight: weightVal
      })
      if (that.data.weight == weightVal && weightVal != 0){
        that.setData({
          times: that.data.times + 1
        })
      }else {
        that.setData({
          times: 0
        })
      }
      if(that.data.times == 10) {
        that.shipmentGoods()
      }
     

    })
  },
  // 结束卸货
  back() {
    wx.navigateTo({
      url: '../newPage/newPage'
    })
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