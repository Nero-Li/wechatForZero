// pages/boss/operation/shipment/shipment_finish/index.js
let app = getApp()
import util from '../../../../../utils/util.js'
import urlList from '../../../../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listBoxHeight:550,
    isShowLoss: false,//是否报损
    id:'',
    pageNum: 0,
    total: 0,
    customerId:'',
    basicData:{
      businessName: '', //商家名称
    },
    billList:{
      
    },
    lossList:[
      { id: '1', signNO: '100033394441', date: '2019-04-22', sign: '8-', weight: '41.4' },
    ],
    //员工
    employee:{
      list:[
        { name: '曹三', id: 1, active: false },
      ],
      choosedId:'',
    }
    
  },
  getListBoxHeight(){
    let windowScrollHeight, footerBoxHeight,selft = this
    app.windowScrollHeight(function(h){
      windowScrollHeight = h;
    })
    app.getQueryNodes(['.footerBox'],function(nodes){
      footerBoxHeight = nodes[0].height
      selft.setData({
        listBoxHeight: windowScrollHeight - footerBoxHeight - 30
      })
    })
    
  },
  //获取完成详情
  shipmentList(obj){
    util.ajax({
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.queryBlanBillSortList,
      data: {
        taskId: this.data.id,
        // taskId:'bcfc580371ddee877fad4e4decaa80e6'
      },
      method: 'post',
      success: (res) => {
        this.setData({
          billList: res.data.data
        })
        let map = {}, dest = [], list = this.data.billList.blankBillDTOList;
        for (let i = 0; i < list.length; i++) {
          let ai = list[i];
          if (!map[ai.categoryId]) {
            dest.push({
              categoryId: ai.categoryId,
              categoryName: ai.categoryName,
              item: [ai]
            });
            map[ai.categoryId] = ai;
            map[ai.categoryName] = ai;
          } else {
            for (let j = 0; j < dest.length; j++) {
              let dj = dest[j];
              if (dj.categoryId == ai.categoryId) {
                dj.item.push(ai);
                break;
              }
            }
          }
        }
        
        this.setData({
          'billList.blankBillDTOList': dest
        })
        console.log('dest', this.data.billList)
      },
    })
  },
  //绑定编辑单价并更新小计
  bindUpdateValue(e) {
    // console.log(this.data.billList)
    let value = e.detail.value,//获取列表对应的值
      dataIndex = e.currentTarget.dataset.dataindex,//获取列表对应的data[]下标
      lItemIndex = e.currentTarget.dataset.litemindex //获取列表对应的下标
    let sumPrice = 0, data = this.data.billList.blankBillDTOList
    this.setData({
      ['billList.blankBillDTOList[' + dataIndex + '].item[' + lItemIndex + '].price']: value,
    })

    for (let i = 0, len = data.length; i < len; i++) {
      let item = data[i].item
      for (let j = 0, il = item.length; j < il; j++) {
        sumPrice += item[j].price * item[j].quantity
      }
    }
    this.setData({
      ['billList.amount']: sumPrice.toFixed(2),
      ['billList.realAmount']: sumPrice.toFixed(2),
    })
  },
  //更新实收
  bindUpdateRealAmount(e){
    let value = e.detail.value
    this.setData({
      'billList.realAmount': value
    })
  },
  //确认结束出货
  bindUpdateBlankbill(){
    let parame = [], listObj = {},list = this.data.billList.blankBillDTOList
    listObj.amount = this.data.billList.amount
    listObj.realAmount = this.data.billList.realAmount
    for (let i = 0, len = list.length; i < len; i++) {
      let item = list[i].item
      for (let j = 0, iTemListLen = item.length; j < iTemListLen; j++){
        let iTemItem = item[j]
        if (iTemItem.price == '' || !iTemItem.price) {
          wx.showToast({ title: '单价填写全', icon: 'none', duration: 2000, mask: true });
          return
        }
        parame.push(iTemItem)
      }
      
    }
    listObj.blankBillDTOList = parame
    util.ajax({
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.updateBlankBill,
      data: listObj,
      method: 'post',
      success: (res) => {
        // wx.showToast({ title: '成功', icon: 'none', duration: 2000, mask: true });
        wx.reLaunch({
          url: '/pages/boss/operation/shipment/index',
        })
      },
    })
  },
  //报损切换
  bindShowLoss(e){
    let value = e.detail.value
    if (value == 1){
      this.setData({
        isShowLoss:true
      })
    }else{
      this.setData({
        isShowLoss: false
      })
    }
  },
  //选择员工
  bindchooseEmployee(e){
    console.log(e)
    let id = e.currentTarget.dataset.id,
      active = e.currentTarget.dataset.active,
      index = e.currentTarget.dataset.index
    let eList = this.data.employee.list
    for (let i = 0, list = eList.length; i < list; i++ ){
      this.setData({
        ['employee.list[' + i + '].active']: false
      })
    }
      this.setData({
        ['employee.list[' + index + '].active'] : !active
      })
    if (eList[index].active){
      this.setData({
        ['employee.choosedId']: id
      })
    }else{
      this.setData({
        ['employee.choosedId']: ''
      })
    }
  },
  //报损事件
  bindBtnLoss(e){
    let lossId = e.currentTarget.dataset.id
    if (lossId){
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
    }else{
      wx.showToast({
        icon: 'none',  //图标，支持"success"、"loading" none
        title: '请选择操作员工',
      })
    }
  },
  //打印凭证
  bindToPrintVoucher() {
    wx.showToast({
      icon: 'success',  //图标，支持"success"、"loading" none
      title: '打印凭证成功',
      success() {
        setTimeout(()=>{
          wx.switchTab({
            url: '../../index'
          })
        },1000)
      }
    })
  },
  //加载更多
  refreshListData(){
    this.shipmentList({
      loadMore:true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '出货完成详情'
    })
    this.setData({
      id: options.taskId,
      customerId: options.cussupId,
      'basicData.businessName': options.cussupName
    })
    this.shipmentList({
     
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