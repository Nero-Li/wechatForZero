// pages/boss/operation/inventory/scan/barcode/index.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listBoxHeight: 510,
    reasonValue:'',
    basicData: {
      fullName: '李青松',//姓名
      date: '2019-04-22',//出货时间
    },
    lossList: [
      { id: '1', name: '红鸡蛋', signNO: '100033394441', from: '青松食品', sign: '8-', weight: '41.4' },
      { id: '2', name: '白鸡蛋', signNO: '100033394442', from: '青松食品', sign: '实重', weight: '41.4' },
    ],
    //员工
    employee: {
      list: [
        { name: '曹三', id: 1, active: false },
        { name: '曹三', id: 1, active: false },
        { name: '曹三', id: 1, active: false },
        { name: '曹三', id: 1, active: false },
        { name: '曹三', id: 1, active: false },
        { name: '曹三', id: 1, active: false },
      ],
      choosedId: '',
    },
    reasonList:{
      list:[
        { id: '1', text: '鸡蛋已发臭' },
        { id: '1', text: '大部分鸡蛋在路上已损坏' },
        { id: '1', text: '鸡蛋已发臭' },
        { id: '1', text: '大部分鸡蛋在路上已损坏' },
        { id: '1', text: '鸡蛋已发臭' },
        { id: '1', text: '大部分鸡蛋在路上已损坏' },
      ]
    }
  },
  getListBoxHeight() {
    let windowScrollHeight, footerBoxHeight, selft = this
    app.windowScrollHeight(function (h) {
      windowScrollHeight = h;
    })
    app.getQueryNodes(['.footerBox'], function (nodes) {
      footerBoxHeight = nodes[0].height
      selft.setData({
        listBoxHeight: windowScrollHeight - footerBoxHeight - 60
      })
    })
  },
  //动态输入报损原因
  bindreasonChange(e){
    let value = e.detail.value
    this.setData({
      reasonValue: value
    })
  },
  //选择原因
  bindGetReason(e){
    let text = e.currentTarget.dataset.text
    this.setData({
      reasonValue: text
    })
  },
  //选择员工
  bindchooseEmployee(e) {
    let id = e.currentTarget.dataset.id,
      active = e.currentTarget.dataset.active,
      index = e.currentTarget.dataset.index
    let eList = this.data.employee.list
    for (let i = 0, list = eList.length; i < list; i++) {
      this.setData({
        ['employee.list[' + i + '].active']: false
      })
    }
    this.setData({
      ['employee.list[' + index + '].active']: !active
    })
    if (eList[index].active) {
      this.setData({
        ['employee.choosedId']: id
      })
    } else {
      this.setData({
        ['employee.choosedId']: ''
      })
    }
  },
  //报损事件
  bindBtnLoss(e) {
    let lossId = e.currentTarget.dataset.id
    if (lossId) {
      wx.showModal({
        title: '',
        content: '是否报损该订单？',
        success() {
          wx.showToast({
            icon: 'success',  //图标，支持"success"、"loading" none
            title: '报损成功',
            success() {

            }
          })
        }
      })
    } else {
      wx.showToast({
        icon: 'none',  //图标，支持"success"、"loading" none
        title: '请选择操作员工',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '条码信息'
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
    this.getListBoxHeight()
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