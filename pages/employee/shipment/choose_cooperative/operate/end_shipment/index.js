// pages/employee/shipment/choose_cooperative/operate/end_shipment/index.js
import util from '../../../../../../utils/util.js'
import urlList from '../../../../../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cooperativeName: '',
    shipmentList: [],
    taskId: '',
    id: '',
  },
  //查询出货商品
  getShipmentStatistics(obj) {
    util.ajax({
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.shipmentGoodsList,
      data: {
        "customerId": this.data.id,
        "taskId": this.data.taskId,
        "sortType": 2
      },
      method: 'post',
      success: (res) => {
        this.setData({
          totalNumber: 0,
          shipmentList: []
        })
        let tmpData = []
        let curMap = res.data.map
        for (let key in curMap) {
          tmpData.push({
            name: key,
            list: curMap[key]
          })
        }
        this.setData({
          shipmentList: tmpData
        })
        //计算总出货数--totalNumber
        let spMentList = this.data.shipmentList, listTotal = 0
        for (let i = 0, len = spMentList.length; i < len; i++) {
          let item = spMentList[i]
          listTotal += item.list.total
        }
        this.setData({
          totalNumber: listTotal + this.data.totalNumber
        })
      },
    })
  },
  //返回首页
  bindToIndex(){
    wx.reLaunch({
      url: '/pages/employee/index/index?openPage=/pages/employee/shipment/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '结束出货',
    })
    wx.getStorage({
      key: 'selectedCustomer',
      success: (res) => {
        let data = res.data
        this.setData({
          cooperativeName: data.name,
          id: data.id,
          taskId: data.taskId,
        })
        this.getShipmentStatistics({
        })
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