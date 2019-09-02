// pages/employee/loss/after_sale/details/scan/details/index.js
let app = getApp()
import util from '../../../../../../../utils/util.js'
import urlList from '../../../../../../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsItem: {},
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
    goodsNo: '',
    brokenGoodsNo: '',
    changeGoodsNo:'',
    id: '',
    status: '1',
    reasonList: {
      list: [
        { id: '1', text: '天灾损坏' },
        { id: '1', text: '鸡蛋损坏' },
        { id: '1', text: '运输途中鸡蛋破裂' },
        { id: '1', text: '收到货鸡蛋有异味' },
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
    let status = e.currentTarget.dataset.status
    this.status = status
    //扫码回收鸡蛋
    // if (status === '0') {
      // ee13c7b79758b05e57f21764b2eb93cd  GJAQ00000132
    //   this.getBroken('ee13c7b79758b05e57f21764b2eb93cd')
    // return
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        // console.log('wx.scanCode=>result:', res)
        let result = res.result
        //确认售后出货
        if (status === '1') {
          this.getBroken(result, (goodsNo) => {
            wx.showModal({
              title: '',
              content: '是否继续售后出货？',
              confirmText: '继续',
              confirmColor: '#67c239',
              success:  (res) => {
                if (res.confirm) {
                  this.comfrimSale(goodsNo)
                }
              }
            })
          })
        }
        if (status === '0') {
          this.getBroken(result, (goodsNo) => {
            wx.showModal({
              title: '',
              content: '确认报损货物？',
              confirmText: '报损',
              confirmColor: '#67c239',
              success: (res) => {
                if (res.confirm) {
                  this.comfrimSale2(goodsNo)
                }
              }
            })
          })
        }
        
      },
      fail: (res) => {

      }
    })
  },
  //确认售后出货 -- 数据对接
  comfrimSale(goodsNo){
    util.ajax({
      completed: true,
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.brokenstep1,
      data: {
        goodsNo,
        id: this.data.id
      },
      method: 'post',
      success: (res) => {
        let data = res.data, dataObj = data.data
        if (data.state === 1){
          this.setData({
            changeGoodsNo: 0
          })
          if (this.brokenGoodsNo != 'null' && this.changeGoodsNo != 'null') {
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
          }
        } else {
          wx.showToast({ title: data.message, icon: 'none', duration: 2000 });
        }
      },
    })
  },
  //回收鸡蛋- 数据对接
  comfrimSale2(goodsNo) {
    util.ajax({
      completed: true,
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.brokenstep2,
      data: {
        goodsNo,
        remark: this.data.reasonValue,
        id: this.data.id
      },
      method: 'post',
      success: (res) => {
        let data = res.data, dataObj = data.data
        if (data.state === 1) {
          this.setData({
            brokenGoodsNo: 0
          })
          if (this.brokenGoodsNo != 'null' && this.changeGoodsNo != 'null') {
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
          }
        } else {
          wx.showToast({ title: data.message, icon: 'none', duration: 2000 });
        }
      },
    })
  },
  //售后回收损坏的数据对接
  getBroken(barcodeid,fn) {
    if (this.status == '0') {
      let reason = this.data.reasonValue
      if (reason) {

      } else {
        wx.showToast({
          icon: 'none',  //图标，支持"success"、"loading" none
          title: '请填写或选择报损原因',
        })
        return
      }
    }
    util.ajax({
      completed: true,
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.goodview,
      data: {
        barcodeid,
        type: '2',
      },
      method: 'post',
      success: (res) => {
        let data = res.data, dataObj = data.data[0]
        if (data.state === 1) {
          //确认报损货物
          if (dataObj.goodsNo == this.data.goodsNo && this.status == '0'){
            this.setData({
              lossList: dataObj
            })
            !!fn && fn(dataObj.goodsNo);
            return
          }
          if (dataObj.goodsNo != this.data.goodsNo && this.status == '0'){
            wx.showToast({ title: '货物不一致，回收失败', icon: 'none', duration: 2000 });
            return
          }
          if (this.status == '1'){
            this.setData({
              lossList: dataObj
            })
            !!fn && fn(dataObj.goodsNo);
          }
        } else {
          wx.showToast({ title: data.message, icon: 'none', duration: 2000 });
        }
        console.log('resresresres', res)
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (options.brokenGoodsNo != 'null' || options.changeGoodsNo != ''){
    //   wx.getStorage({
    //     key: 'goodview',
    //     success: (res) => {
    //       this.setData({
    //         lossList: res.data
    //       })
    //     },
    //   })
    // }
    wx.setNavigationBarTitle({
      title: '报损订单信息'  //修改title
    })
    // brokenGoodsNo: '',
    //changeGoodsNo: '',
    this.setData({
      goodsNo: options.goodsNo,
      brokenGoodsNo: options.brokenGoodsNo,
      changeGoodsNo: options.changeGoodsNo,
      id: options.id
    })

    wx.getStorage({
      key: 'goodsItem',
      success: (res) =>  {
        this.setData({
          goodsItem: res.data
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getListBoxHeight()
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