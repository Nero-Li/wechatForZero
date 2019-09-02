// pages/common/information/perfect/index.js
import util from '../../../../utils/util.js'
import urlList from '../../../../api/api.js'
let userData = wx.getStorageSync('accountLogin')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{
      name:'',//姓名
      phone: '',//手机号码
      // cardID: '',//身份证
      storeAddress: '',//门店地址
      shopId:'',//门店ID
    },
  },
  //绑定填写姓名电话
  bindChangeValue(e){
    let input = e.currentTarget.dataset.input
    if (input === 'name'){
      this.setData({
        'userInfo.name': e.detail.value
      })
    }
    if (input === 'phone') {
      this.setData({
        'userInfo.phone': e.detail.value
      })
    }
  },
 //跳转选择门店地址
  toStoreAddress(){
    wx.navigateTo({
      url: '../store_address/index'
    })
  },
  //跳转核对信息页
  bindNext(){
    let userI = this.data.userInfo
    if (userI.name == ''){
      wx.showToast({ title: '姓名不能为空', icon: 'none', duration: 2000 });
    } else if(userI.phone == ''){
      wx.showToast({ title: '手机号码不能为空', icon: 'none', duration: 2000 });
    } else if (userI.storeAddress == '') {
      wx.showToast({ title: '门店地址不能为空', icon: 'none', duration: 2000 });
    }else{
      wx.navigateTo({
        url: '../check/index?name=' + userI.name + '&phone=' + userI.phone + '&storeAddress=' + userI.storeAddress + '&shopId=' + userI.shopId
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userData = wx.getStorageSync('accountLogin')
    if (options.address && options.shopId){
      this.setData({
        userInfo: {
          name: userData.user.name,//姓名
          phone: userData.user.loginname,//手机号码
          storeAddress: options.address,//门店地址
          shopId: options.shopId
        }
      })
    }else{
      util.getUserShop({
        id: userData.user.shopId,
        url: urlList.getShop,
        fn: (res) => {
          // console.log('res', res)
          this.setData({
            userInfo: {
              name: userData.user.name,//姓名
              phone: userData.user.loginname,//手机号码
              storeAddress: res.address,//门店地址
              shopId: userData.user.shopId
            }
          })
        },
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