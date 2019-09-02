// pages/boss/operation/index.js
import util from '../../../utils/util.js'
import urlList from '../../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      {
        text:'卸货',
        icon:'../../../images/boss/btn_disburden.png',
        link:'./disburden/index',
        bgClass:'bg_2f80d2',
      },
      {
        text: '出货',
        icon: '../../../images/boss/btn_shipment.png',
        link: './shipment/index',
        bgClass: 'btn_wechat',
      },
      {
        text: '库存',
        icon: '../../../images/boss/btn_inventory.png',
        link: './inventory/index',
        bgClass: 'bg_8c98cc',
      },
    ]
  },

  //自损扫一扫
  bindToSelfLoss() {
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

  },
  //添加报损  -- 自损货售后损坏的数据对接，0 ,1
  getBroken(barcodeid) {
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
        let data = res.data, dataObj = data.data
        if (data.state === 1) {
          wx.setStorage({
            key: 'goodview',
            data: dataObj,
            success() {
              wx.navigateTo({
                url: '/pages/employee/loss/self_destruction/details/index?brokenGoodsNo=' + dataObj.goodsNo,
              })
            }
          })
        } else {
          wx.showToast({ title: data.message, icon: 'none', duration: 2000 });
        }
        // console.log('resresresres', res)
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '操作'  //修改title
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