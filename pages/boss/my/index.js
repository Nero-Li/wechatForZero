// pages/boss/my/index.js
let app = getApp()
let userData = wx.getStorageSync('accountLogin')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../../images/boss/headPortrait.png',//头像
    name: '',
    phone: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(userData)
    this.setData({
      name: userData.user.name,
      phone: userData.user.loginname
    })
    wx.setNavigationBarTitle({
      title: '我的'  //修改title
    })
    
  },
  // 跳转完善信息
  bindToPerfectInformation(){
    wx.navigateTo({
      url: './perfect_information/index',
    })
  },
  // 跳转门店管理
  bindToStoreManagement(){
    wx.navigateTo({
      url: './store_management/index',
    })
  },
  //跳转修改密码
  bindToChangePassword(){
    wx.navigateTo({
      url: './change_password/index',
    })
  },
  //退出登录
  bindLogout(){
    wx.showModal({
      title: '',
      content: '是否退出登录',
      confirmText: '退出',
      confirmColor: '#67c239',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorage({
            key: 'accountLogin',
            success: function (res) {
              wx.removeStorage({
                key: 'wxSessionkey',
                success: function (res) {
                  wx.reLaunch({
                    url: '/pages/login/account/index',
                  })
                }
              })
            }
          })
        }
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
    let userInfo = app.globalData.userInfo
    if (userInfo && userInfo.avatarUrl != '') {
      this.setData({
        avatarUrl: userInfo.avatarUrl
      })
    }
    console.log(app.globalData)
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