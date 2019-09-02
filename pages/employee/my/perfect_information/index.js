// pages/boss/my/perfect_information/index.js
let app = getApp()
import util from '../../../../utils/util.js'
import urlList from '../../../../api/api.js'
let userData = wx.getStorageSync('accountLogin')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:'../../../../images/boss/headPortrait.png',//头像
    userInfo:{
      name: '',
      phone: '',
    },
    phoneFocus: false,
    userNameFocus: false,
  },
  //绑定input框值变化
  bindChangeValue(e){
    let input = e.currentTarget.dataset.input,
      value = e.detail.value
    if (input === 'name'){
        this.setData({
          'userInfo.name':value
        })
    }
    if (input === 'phone') {
      this.setData({
        'userInfo.phone': value
      })
    }
  },
  //提交
  bindSubmit() {
    let userI = this.data.userInfo
    util.updateUserInfo({
      url: urlList.editUserInfo,
      data: {
        id: userData.user.id,
        name: userI.name,
        phone: userI.phone,
      },
      fn: (res) => {
        // console.log('res',res)
        if (res.code == 200) {
          userData.user.name = this.data.userInfo.name
          userData.user.loginname = this.data.userInfo.phone
          wx.removeStorageSync('accountLogin')
          wx.setStorage({
            key: 'accountLogin',
            data: userData
          })
            wx.reLaunch({
              url: '../../../employee/index/index'
            })
        }
      }
    })
  },
  
  //聚焦事件
  bindUNFocus(){
    this.setData({
      userNameFocus:true
    })
  },
  bindPFocus(){
    this.setData({
      phoneFocus: true
    })
  },
  //获取本地图片事件
  bindChooseImage(){
    let self = this
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        console.log(res)
        self.setData({
          avatarUrl: res.tempFilePaths
        })
        let userInfo = app.globalData.userInfo
        userInfo.avatarUrl = res.tempFilePaths
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userData = wx.getStorageSync('accountLogin')
    this.setData({
      userInfo:{
        name: userData.user.name,
        phone: userData.user.loginname,
      }
    })
    wx.setNavigationBarTitle({
      title: '完善信息',
    })
    let userInfo = app.globalData.userInfo
    if (userInfo && userInfo.avatarUrl != '') {
      this.setData({
        avatarUrl: userInfo.avatarUrl
      })
    }
    console.log(app.globalData)
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
    userData = wx.getStorageSync('accountLogin')
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