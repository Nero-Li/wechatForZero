// pages/employee/shipment/choose_cooperative/operate/index.js
let app = getApp()
import util from '../../../../../utils/util.js'
import urlList from '../../../../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cooperativeName:'',
    tableTrListHeight:'',
    taskId:'',
    id:'',
    totalNumber: 0,//出货总数
    status: '',
    shipmentList: [
      // {
      //   name: '白鸡蛋',
      //   total: '550',
      //   unit: '箱',
      //   list: [
      //     { id: '1', sign: '8', number: '413', },
      //     { id: '2', sign: '7-', number: '41', },
      //     { id: '2', sign: '实重', number: '41', },
      //   ]
      // },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.tableTrScroll()
    
  },
  //出货商品 内容可滚动区域计算
  tableTrScroll() {
    let winHeight = 0, sumResHeight = 0;
    app.windowScrollHeight((height) => { winHeight = height })
    app.getQueryNodes(['.headerBox', '.footerBox'], (res) => {
      for (let i = 0, len = res.length; i < len; i++) {
        sumResHeight += res[i].height
      }
      this.setData({
        tableTrListHeight: (winHeight - sumResHeight) + 'px'
      })
    })
  },
  //开始出货 -- 扫一扫
  bindStartShipment(){
    // this.shipmentGoodsAdd({
    //   barCodeString: '6159c9f8750b4526e97a08ff14fbd41a'
    // })
    // return
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        let result = res.result
        this.shipmentGoodsAdd({
          barCodeString: result
        })
      },
      fail: (res) => {
        console.log('fail', res)
      }
    })
  },
  //跳转已出货物
  bindToOutStock(){
    wx.navigateTo({
      url: './out_stock/index',
    })
  },
  ///跳转结束出货
  bindToEndShipment() {
    let self = this
    util.ajax({
      completed: true,
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.emplyeeFinishTask,
      data: {
        "cussupId": this.data.id,
        "id": this.data.taskId,
      },
      method: 'post',
      success: (res) => {
        wx.setStorage({
          key: 'selectedCustomer',
          data: {
            name: self.data.cooperativeName,
            id: self.data.id,
            taskId: self.data.taskId,
            status: 3
          },
          success:() =>{
            wx.navigateTo({
              url: './end_shipment/index',
            })
          }
        })
        
      },
    })
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
        for (let i = 0, len = spMentList.length; i < len; i++){
          let item = spMentList[i]
          listTotal += item.list.total
        }
        this.setData({
          totalNumber: listTotal + this.data.totalNumber
        })
      },
    })
  },
  //添加出货商品
  shipmentGoodsAdd(obj){
    util.ajax({
    //  completed: true,
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading', mask: true });
      },
      url: urlList.shipmentGoodsAdd,
      data: {
        "customerId": this.data.id,
        "taskId": this.data.taskId,
        "barCodeString": obj.barCodeString,
      },
      method: 'post',
      success: (res) => {
        let data = res.data
        if (data.state === 1){
          this.getShipmentStatistics({})
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
    wx.getStorage({
      key: 'selectedCustomer',
      success: (res) => {
        let data = res.data
        this.setData({
          cooperativeName: data.name,
          id: data.id,
          taskId: data.taskId,
          status: data.status
        })
        wx.setNavigationBarTitle({
          title: this.data.cooperativeName  //修改title
        })
        this.getShipmentStatistics({
        })
      },
    })
    
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