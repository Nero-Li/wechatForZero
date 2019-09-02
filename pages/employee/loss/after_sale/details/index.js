// pages/employee/loss/after_sale/details/index.js
let app = getApp()
import util from '../../../../..//utils/util.js'
import urlList from '../../../../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listBoxHeight: 500,
    reasonValue: '',
    basicData: {
      fullName: '',//姓名
      date: '',//出货时间
    },
    lossList: {
      goodsNo: '',
      categoryname: '', 
      list: [
        // { from: '青松食品', sign: '8-', weight: '41.4', number: '1' },
        // { from: '青松食品2', sign: '实重 -4', weight: '41.4', number: '10' },
      ]
    },
    reasonList: {
      list: [
        { id: '1', text: '天灾损坏' },
        { id: '1', text: '鸡蛋损坏' },
        { id: '1', text: '运输途中鸡蛋破裂' },
        { id: '1', text: '收到货鸡蛋有异味' },
      ]
    },
    brokenGoodsNo: '',
    id: '',
  },

  getListBoxHeight() {
    let windowScrollHeight, footerBoxHeight, selft = this
    app.windowScrollHeight(function (h) {
      windowScrollHeight = h;
    })
    app.getQueryNodes(['.footerBox'], function (nodes) {
      footerBoxHeight = nodes[0].height
      selft.setData({
        listBoxHeight: windowScrollHeight - footerBoxHeight - 80
      })
    })
  },
  //动态输入报损原因
  bindreasonChange(e) {
    let value = e.detail.value
    this.setData({
      reasonValue: value
    })
  },
  //选择原因
  bindGetReason(e) {
    let text = e.currentTarget.dataset.text
    this.setData({
      reasonValue: text
    })
  },
  //报损事件
  bindBtnLoss(e) {
    let reason = e.currentTarget.dataset.reason
    if (reason) {
      wx.showModal({
        title: '',
        content: '是否提交该报损订单？',
        success: (e) => {
          if(e.confirm){
            this.comfrimSale()
          }
        }
      })
    } else {
      wx.showToast({
        icon: 'none',  //图标，支持"success"、"loading" none
        title: '请填写或选择报损原因',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '报损订单信息'  //修改title
    })
    wx.getStorage({
      key: 'goodview2',
      success: (res) => {
        this.setData({
          lossList: res.data
        })
      },
    })
    if (options.brokenGoodsNo){
      this.setData({
        brokenGoodsNo: options.brokenGoodsNo,
        id: options.id
      })
    }
  },
  //完成售后 -- 数据对接
  comfrimSale() {
    let reason = this.data.reasonValue
    if (reason) {
      
    } else {
      wx.showToast({
        icon: 'none',  //图标，支持"success"、"loading" none
        title: '请填写或选择报损原因',
      })
      return
    }
    util.ajax({
      completed: true,
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.brokenstep2,
      data: {
        goodsNo: this.data.brokenGoodsNo,
        remark: this.data.reasonValue,
        id:this.data.id
      },
      method: 'post',
      success: (res) => {
        let data = res.data, dataObj = data.data
        if (data.state === 1) {
          wx.showToast({
            icon: 'success',  //图标，支持"success"、"loading" none
            title: '已完成售后',
            success() {
              setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/employee/loss/after_sale/index',
                })
              }, 1000)
            }
          })
        } else {
          wx.showToast({ title: data.message, icon: 'none', duration: 2000 });
        }
      },
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