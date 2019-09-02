// pages/employee/index/index.js
let app = getApp()
let userData = wx.getStorageSync('accountLogin')
import util from '../../../utils/util.js'
import urlList from '../../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //报损
    lossList: [
      // {
      //   text: '自损',
      //   icon: '../../../images/icon_self_destruction.png',
      //   link: '../loss/self_destruction/index',
      //   bgClass: 'bg_2f80d2',
      // },
      {
        text: '售后',
        icon: '../../../images/icon_after_sale.png',
        link: '../loss/after_sale/index',
        bgClass: 'bg_67c239',
      }
    ],
    //出货
    shipmentList: [
      {
        text: '出货',
        icon: '../../../images/btn_shipment.png',
        link: '../shipment/choose_cooperative/index',
        bgClass: 'btn_wechat',
      },
    ],
    pageShow:'',
    navItemData: {},
    avatarUrl: '../../../images/boss/headPortrait.png',//头像
    name: '',
    phone: '',
  },
  //报损扫一扫
  bindScanBrokenQR(e){
    console.log(e)
    let urlData = e.currentTarget.dataset.url
    //自损
    if (urlData === '../loss/self_destruction/index') {
      // b6939b0baa6b1c3d404833999ee84e05
      // this.getBroken('b6939b0baa6b1c3d404833999ee84e05')
      // return
      wx.scanCode({
        onlyFromCamera: true,
        success: (res) => {
          // console.log('wx.scanCode=>result:', res)
          let result = res.result
          this.getBroken(result)
        },
        fail: (res) => {
          // console.log('fail', res)
        }
      })
    }
    //售后
    if (urlData === '../loss/after_sale/index') {
      wx.navigateTo({
        url: '../loss/after_sale/index',
      })
    }
    
  },
  //添加报损  -- 自损货售后损坏的数据对接，0 ,1
  getBroken(barcodeid){
    util.ajax({
      completed: true,
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.goodview,
      data: {
        barcodeid,
        type: '1',
      },
      method: 'post',
      success: (res) => {
        let data = res.data,dataObj = data.data
        if (data.state === 1){
          wx.setStorage({
            key: 'goodview',
            data: dataObj,
            success(){
              wx.navigateTo({
                url: '/pages/employee/loss/self_destruction/details/index?brokenGoodsNo=' + dataObj.goodsNo,
              })
            }
          })
        }else{
          wx.showToast({ title: data.message, icon: 'none', duration: 2000 });
        }
        console.log('resresresres', res)
      },
    })
  },
  //退出登录
  bindLogout() {
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    // this.setData({
    //   pageShow: '/pages/employee/loss/index'
    // })
    // return
    if (options.openPage){
      if (options.openPage == '/pages/employee/my/index'){
        this.setData({
          pageShow: '/pages/employee/my/index'
        })
      }
      if (options.openPage == '/pages/employee/loss/index') {
        this.setData({
          pageShow: '/pages/employee/loss/index'
        })
      }
      if (options.openPage == '/pages/employee/shipment/index') {
        this.setData({
          pageShow: '/pages/employee/shipment/index'
        })
      }
    }else{
      //没有该参数则默认打开我的页面
      this.setData({
        pageShow:'/pages/employee/my/index'
      })
    }
    this.titleText(this.data.pageShow);//改变title-function
   
    let self = this;
    this.setData({
      navItemData: app.globalData.employee
    })
    userData = wx.getStorageSync('accountLogin')
    this.setData({
      name: userData.user.name,
      phone: userData.user.loginname
    })
  },
  titleText(pagePath){
    let text = ''
    if (pagePath === '/pages/employee/my/index'){
      text = '我的'
    }
    if (pagePath === '/pages/employee/loss/index'){
      text = '售后'
    }
    if (pagePath === '/pages/employee/shipment/index'){
      text = '出货'
    }
    wx.setNavigationBarTitle({
      title: text  //修改title
    })

  },
  // 导航栏根据对应的页面参数设置状态
  navSetStata(){
    let tabBar = app.globalData.employee,
      pageIsShow = this.data.pageShow
    for (let i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == pageIsShow) {
        tabBar.list[i].active = true;
      }
    }
    this.setData({
      navItemData: tabBar
    });

  },
  //导航栏点击跳转事件
  bindTabNavToPage(e){
    let url = e.currentTarget.dataset.url
    this.setData({
      pageShow: url
    })
    this.navSetStata()
    this.titleText(this.data.pageShow);//改变title-function
  },

  // 跳转完善信息
  bindToPerfectInformation() {
    wx.navigateTo({
      url: '../my/perfect_information/index',
    })
  },
  // 跳转门店管理
  bindToStoreManagement() {
    wx.navigateTo({
      url: '../my/store_management/index',
    })
  },
  //跳转修改密码
  bindToChangePassword() {
    wx.navigateTo({
      url: '../my/change_password/index',
    })
  },
  //跳转我的积分
  bindTointegral() {
    wx.showToast({ title: '正在研发中，敬请期待！', icon: 'none', duration: 2000 });
    // wx.navigateTo({
    //   url: '',
    // })
  },
  //跳转个人业绩
  bindToAchievement() {
    wx.navigateTo({
      url: '../my/achievement/index',
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
    this.navSetStata()
    userData = wx.getStorageSync('accountLogin')
    this.setData({
      name: userData.user.name,
      phone: userData.user.loginname
    })
    let userInfo = app.globalData.userInfo
    console.log(app.globalData)
    if (userInfo && userInfo.avatarUrl != '') {
      this.setData({
        avatarUrl: userInfo.avatarUrl
      })
    }
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