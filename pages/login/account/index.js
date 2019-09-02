// pages/login/account/index.js
import util from '../../../utils/util.js'
import urlList from '../../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    role:'',
    isFristLodin: '',//是否第一次登录
    loginName:'',//账号
    loginPwd:'',//密码
  },
  //改变账号
  bindChangePhone(e){
    let value = e.detail.value
    this.setData({
      loginName: value
    })
  },
  //改变密码
  bindChangePwd(e) {
    let value = e.detail.value
    this.setData({
      loginPwd: value
    })
  },
  //返回微信登录页
  toWeChatLogin(){
    wx.navigateTo({
      url: '../index',
    })
  },
  //点击登录
  bindAccount(){
    let LPhone = this.data.loginName, LPwd = this.data.loginPwd
    if (LPhone == ''){
      wx.showToast({ title: '账号不能为空', icon: 'none', duration: 2000 });
    } else if (LPwd == ''){
      wx.showToast({ title: '密码不能为空', icon: 'none', duration: 2000 });
    }else{
      util.ajax({
        //loading
        loading: () => {
          wx.showLoading({ title: '登录中', icon: 'loading', mask: true});
        },
        url: urlList.loginAccount,
        header: 'application/x-www-form-urlencoded',
        data: 'loginname=' + LPhone + '&loginPwd=' + LPwd,
        method: 'post',
        isLogin: true,
        success: (res) => {
          // console.log('qaswdasdfa',res)
          let data = res.data, loginType = 'acconnt'
          if (data.data){
            wx.setStorage({
              key: 'accountLogin',
              data: data.data
            })
          }

          if (data.code == 200) {
            wx.showToast({ title: data.msg, icon: 'none', duration: 2000 });
            // wx.switchTab({
            //   url: '../../boss/index/index?role=1&loginType=' + loginType,
            // })

            /* type (integer, optional): 身份类型（1-PC端，2-Boss端，3-员工端，4-设备端） , */
            // wx.switchTab({
            //   url: '../../boss/index/index',
            // })
            //店铺老板
            if (data.data.userType == 2) {
              wx.switchTab({
                url: '../../boss/index/index',
              })
              // wx.navigateTo({
              //   url: '../../common/information/perfect/index?role=1&loginType=' + loginType,
              // })
            }
            //店铺员工
            if (data.data.userType == 3){
              wx.reLaunch({
                url: '../../employee/index/index',
              })
              // wx.navigateTo({
              //   url: '../../common/information/perfect/index?role=2&loginType=' + loginType,
              // })
            }
            //设备端
            if (data.data.userType == 4) {
              wx.reLaunch({
                url: '/pages/newPage/newPage',
              })
            }
          }
          if (data.code == 400 || data.code == 201){
            wx.showToast({ title: data.msg, icon: 'none', duration: 2000 });
          }
        },
      })
    }
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