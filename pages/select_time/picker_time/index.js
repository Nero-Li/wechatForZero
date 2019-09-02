// pages/select_time/picker_time/index.js
//     初始化弹窗的内容
const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showWin:true,
    yearchange:'',
    monthchange:'',
  },
  selsectdate: function () {
    this.setData({
      showWin: true  //控制弹窗隐藏显示
    })
  },
  //绑定弹窗的滑动事件

 bindChange: function(e) {
    const val = e.detail.value
    this.setData({
      yearchange: this.data.years[val[0]],
      monthchange: this.data.months[val[1]],
    })
    console.log(this.data.yearchange)
  },
  //取消弹窗和确定弹窗的事件

 // 取消弹窗
  lcaarcancel: function() {
    this.setData({
      showWin: false
    })
  },
  // 确定
  lcafinish: function () {
    var yearchange = this.data.yearchange || '';
    var monthchange = this.data.monthchange || ''
    console.log(monthchange)
    if (!yearchange) {
      this.setData({
        year: date.getFullYear(),
        month: 2,
      })
    } else {
      this.setData({
        year: yearchange,
        month: monthchange,
      })
    }
    this.setData({
      showWin: false,
      line: '-',
    })
  },
  // 点击灰色蒙层的冒泡事件
  stopwin: function () {

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