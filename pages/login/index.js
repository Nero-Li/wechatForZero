// pages/login/index.js
import util from '../../utils/util.js'
import urlList from '../../api/api.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    role:'',
    isFristLodin: '',//是否第一次登录
    code:'',
  },

  //微信登录成功跳转
  bindWeChatLogin(){
    wx.showLoading({
      title: '正在登录...',
    })
    wx.login({
      success: data => {
        console.dir(data);
        this.setData({
          code: data.code
        })
        // return
        this.loginAjax(data.code)

        wx.hideLoading();
        // if (this.data.isFristLodin == '') {
        //   setTimeout(() => {
        //     wx.hideLoading();
        //     wx.navigateTo({
        //       url: '../common/information/perfect/index?role=1'
        //     })
        //   }, 1000)
        // }
      }
    })
  },
  //onGotUserInfo
  onGotUserInfo(e){
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      //用户按了允许授权按钮
      this.bindWeChatLogin()
    } else {
      wx.showToast({ title: '用户拒绝授权，登录失败', icon: 'none', duration: 2000 });
      //用户按了拒绝按钮
    }
  },
  //登录接口对接
  loginAjax(code){
    console.log(code)
    util.ajax({
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      //隐藏loading
      loaded: () => {
        wx.hideLoading();
      },
      url: urlList.wxLogin,
      header:'application/x-www-form-urlencoded',
      data: {
        code
      },
      method: 'post',
      isLogin: true,
      success: (res) => {
        console.log(res)
        let data = res.data
        if (data.state == 1) {
          let dataMap = data.map
          wx.setStorage({
            key: 'wxSessionkey',
            data: dataMap.wxSessionkey
          })
          if (!dataMap.user){
            //第一次未绑定账号，跳转账号登录
            wx.navigateTo({
              url: './account/index'
            })
          }else{
            wx.setStorage({
              key: 'accountLogin',
              data: dataMap
            })
            // wx.switchTab({
            //   url: '../boss/index/index',
            // })
            //type (integer, optional): 身份类型（1-PC端，2-Boss端，3-员工端，4-设备端） ,
            if (dataMap.userType == 2) {
              wx.switchTab({
                url: '../boss/index/index',
              })
              // wx.navigateTo({
              //   url: '../common/information/perfect/index?role=1&loginType=' + loginType,
              // })
            }
            //店铺员工
            if (dataMap.userType == 3) {
              wx.reLaunch({
                url: '../employee/index/index',
              })
              // wx.navigateTo({
              //   url: '../common/information/perfect/index?role=2&loginType=' + loginType,
              // })
            }
            //设备端
            if (dataMap.userType == 4) {
              wx.reLaunch({
                url: '/pages/newPage/newPage',
              })
            }
          }
        }
        if (data.state == 400 || data.state == 500) {
          wx.showToast({ title: '登录失败', icon: 'none', duration: 2000 });
        }
      },
    })
  },
  // 账号登录页面跳转
  bindAccountLogin(){
    wx.navigateTo({
      url: './account/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // util.loginOutTime({})
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