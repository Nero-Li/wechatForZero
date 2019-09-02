// pages/employee/shipment/choose_cooperative/index.js
import util from '../../../../utils/util.js'
import urlList from '../../../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cooperative: {
      pageNum: 1,
      total: 0,
      list:[
        // {id: '1', name: '青松食品',}
      ]
    },
    keyWord: '',
    noData: false,
  },
  //动态改变关键词
  bindKeyWordChange(e) {
    let keyWord = e.detail.value
    this.setData({
      keyWord,
    })
  },
  bindSearchConfirm(){
    this.setData({
      'cooperative.pageNum': 1,
      'cooperative.total':0,
      'cooperative.list': [],
    })
    this.getCustomerList({})
  },
  //跳转正在装货操作页面
  bindToOperate(e) {
    let id = e.currentTarget.dataset.id, name = e.currentTarget.dataset.name
    this.addShipmentTask({
      id
    })
    .then( (res) => {
      let data = res.data.data
      wx.setStorage({
        key: 'selectedCustomer',
        data: {
          id, name,
          taskId: data.id,
          status: res.data.data.status
        },
        success:() =>{
          wx.navigateTo({
            url: './operate/index',
          })
        }
      })
    })
    
  },
  //新增出货任务
  addShipmentTask(obj) {
    return new Promise((resolve, reject) => {
      util.ajax({
        completed: true,
        //loading
        loading: () => {
          wx.showLoading({ title: '加载中', icon: 'loading' });
        },
        url: urlList.shipmentTaskAdd,
        data: {
          "cussupId": obj.id,
        },
        method: 'post',
        success: (res) => {
          resolve(res)
        },
      })
    })

  },
  getCustomerList(obj){
    util.ajax({
      loadMore: obj.loadMore,
      total: this.data.cooperative.total,
      loadedNum: this.data.cooperative.list.length,
      pageNum: this.data.cooperative.pageNum,
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.getCustomerList,
      data: {
        "current": 1,
        "size": 20,

        // "code": "string",
        // "companyId": "string",
        // "current": 0,
        // "dr": 0,
        // "id": "string",
        // "ids": [
        //   "string"
        // ],
        // "modifier": this.data.keyWord,
        // "modifytime": "2019-05-20T07:22:06.723Z",
        // "pages": 0,
        // "shopId": "string",
        "name": this.data.keyWord,
        // "status": "string",
        // "total": 0,
        // "type": "2"
      },
      method: 'post',
      success: (res) => {
        let cooperativeList = this.data.cooperative.list, data = res.data, resList = data.data.list, totalData = res.data.totaldata
        for (let i = 0, len = resList.length; i < len; i++) {
          let item = resList[i]
          cooperativeList.push(item)
        }
        this.setData({
          'cooperative.pageNum': this.data.cooperative.pageNum + 1,
          'cooperative.total': data.data.total,
          'cooperative.list': cooperativeList,
        })
        if (this.data.cooperative.list.length == 0) {
          this.setData({
            noData: true
          })
        } else {
          this.setData({
            noData: false
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '选择合作商'  //修改title
    })
    this.getCustomerList({
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
    this.getCustomerList({
      loadMore: true
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})