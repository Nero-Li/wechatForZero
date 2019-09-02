// pages/common/information/check/index.js
import util from '../../../../utils/util.js'
import urlList from '../../../../api/api.js'
let userData = wx.getStorageSync('accountLogin')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      name: '',//姓名
      phone: '',//手机号码
      // cardID: '',//身份证
      storeAddress: '',//门店地址
      shopId: '',//门店ID
    },
  },

  bindSubmit() {
    let userI = this.data.userInfo
    util.updateUserInfo({
      url: urlList.editUserInfo,
      data:{
        id: userData.user.id,
        name: userI.name,
        phone: userI.phone,
        shopId: userI.shopId
      },
      fn:(res)=>{
        // console.log('res',res)
        if(res.code == 200){
          userData.user.name = this.data.userInfo.name
          userData.user.loginname = this.data.userInfo.phone
          userData.user.shopId = this.data.userInfo.shopId
          wx.removeStorageSync('accountLogin')
          wx.setStorage({
            key: 'accountLogin',
            data: userData
          })
          if (userData.userType == 2){
            wx.reLaunch({
              url: '../../../employee/index/index'
            })
          }
        }else{
          wx.switchTab({
            url: '../../../boss/index/index'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options',options)
    if (options.storeAddress && options.shopId && options.phone && options.shopId) {
      this.setData({
        userInfo: {
          name: options.name,//姓名
          phone: options.phone,//手机号码
          storeAddress: options.storeAddress,//门店地址
          shopId: options.shopId
        }
      })
    }
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