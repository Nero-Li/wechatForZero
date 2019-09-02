// pages/boss/bill/details/index.js
let app = getApp()
import util from '../../../../utils/util.js'
import urlList from '../../../../api/api.js'
let userData = wx.getStorageSync('accountLogin')

//记账：未结清，销账：已结清
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listBoxHeight: 560,
    isShowLossList:false,
    noData: false,
    id:'',
    realAmount:'',
    basicData: {
      // business: '合作商',//商家
      // businessName: '青松食品', //商家名称
      // stata:'0',//账单状态
      // billMoney:'120500',
    },
    billList: [
      // {
      //   name: '红鸡蛋',
      //   id:'1',
      //   noEdit: true,
      //   list: [
      //     { id: '1', from: '青松食品', sign: '8-', price: '41.4', number: '20' },
      //     { id: '2', from: '青松食品', sign: '8', price: '10', number: '20' },
      //     { id: '3', from: '青松食品', sign: '实重', price: '10', number: '20' },
      //     { id: '4', from: '青松食品', sign: '实重 -4', price: '10', number: '20' },
      //   ],
      // },
    ],
    //报损列表
    lossList:[
      { id: '1', signNO: '100023456682', sign: '8', weight: '41.3', date: '2019-04-22' },
      { id: '2', signNO: '100023456683', sign: '8 -', weight: '500', date: '2019-04-22' },
    ],
  },
  //计算可滚动高度
  getListBoxHeight() {
    let windowScrollHeight, footerBoxHeight, selft = this
    app.windowScrollHeight(function (h) {
      windowScrollHeight = h;
    })
    app.getQueryNodes(['.footerBox'], function (nodes) {
      footerBoxHeight = nodes[0].height
      selft.setData({
        listBoxHeight: windowScrollHeight - footerBoxHeight - 50
      })
    })
  },
  //获取账单详情
  getBillDetails(id){
    util.ajax({
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.billDetails,
      data: {
        id,
      },
      method: 'post',
      success: (res) => {
        let data = res.data, list = data.data.billDetailsList, billList = this.data.billList
        if (list.length != 0){
          for (let i = 0, len = list.length; i < len; i++) {
            let item = list[i]
            item.unEdit = true
          }
          let map = {}, dest = [];
          for (let i = 0; i < list.length; i++) {
            let ai = list[i];
            if (!map[ai.goodsCategoryId]) {
              dest.push({
                goodsCategoryId: ai.goodsCategoryId,
                goodsCategoryName: ai.goodsCategoryName,
                unEdit: ai.unEdit,
                item: [ai]
              });
              map[ai.goodsCategoryId] = ai;
              map[ai.goodsCategoryName] = ai;
              map[ai.unEdit] = ai;
            } else {
              for (let j = 0; j < dest.length; j++) {
                let dj = dest[j];
                if (dj.goodsCategoryId == ai.goodsCategoryId) {
                  dj.item.push(ai);
                  break;
                }
              }
            }
          }
          this.setData({
            noData: false,
            'billList': dest
          })
        }else{
          this.setData({
            noData: true
          })
        }
      },
    })
  },
  //绑定是否可以编辑事件
  bindIsEdit(e){
    let noE = e.currentTarget.dataset.noedit,
      index = e.currentTarget.dataset.index,
      billList = this.data.billList[index].item
    this.setData({
      ['billList[' + index + '].unEdit']: !noE
    })
    for (let i = 0, len = billList.length; i < len; i++){
      this.setData({
        ['billList[' + index + '].item[' + i + '].unEdit']: !noE
      })
    }
    
    if (!noE){
      this.billEditAmount({
        unloadDetails: [...billList],
      })
    }
  },
  //绑定编辑单价、数量更新编辑值，并更新小计,总价
  bindUpdateValue(e){
    let name = e.currentTarget.dataset.name,//获取列表对应的标题名称
      value = e.detail.value,//获取列表对应的值
      dataIndex = e.currentTarget.dataset.dataindex,//获取列表对应的data[]下标
      lItemIndex = e.currentTarget.dataset.litemindex //获取列表对应的下标
    let list = this.data.billList,sumPrice = 0
    this.setData({
      ['billList[' + dataIndex + '].item[' + lItemIndex +'].price']: value
    })
    for(let i = 0, len = list.length; i < len; i++){
      let item = list[i].item
      for (let j = 0, itemLen = item.length; j < itemLen; j++){
        let iLem = item[j]
        sumPrice += iLem.price * iLem.quantity
      }
    }
    this.setData({
      'basicData.billMoney': sumPrice.toFixed(2)
    })
  },
  //保存--更新账单详情金额
  billEditAmount(obj){
    util.ajax({
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.billEditAmount,
      data: {
        // "amount": 0,
        // "billDate": "2019-05-17T12:46:38.866Z",
        // "billNo": "string",
        // "categoryname": "string",
        // "companyId": "string",
        // "cussupId": "string",
        "id": this.data.id,
        // "quantity": obj.quantity,
        "realAmount": this.data.basicData.billMoney,
        // "remark": "string",
        // "shopId": "string",
        // "statusName": "string",
        // "type": "string",
        "UnloadDetails": [...obj.unloadDetails
          // {
          //   "amount": 0,
          //   "billId": "string",
          //   "companyId": "string",
          //   "goodsCategoryId": "string",
          //   "id": "string",
          //   "price": 0,
          //   "programId": "string",
          //   "quantity": 0,
          //   "remark": "string",
          //   "shopId": "string",
          //   "specificationId": "string"
          // }
        ]
      },
      method: 'post',
      success: (res) => {
        
      },
    })
  },
  //绑定显示报损列表事件
  bindShowLossList(e){
    let isShow = e.currentTarget.dataset.isshow
    this.setData({
      isShowLossList:!isShow
    })
  },
  //绑定改变账单未结清，未回款状态 -- 状态 1：未结清，-1：已结清
  bindChangeBillState(e) {
    let stata = e.currentTarget.dataset.stata
    //0：未结清
    if (stata == '1') {
      wx.showModal({
        title: '',
        content: '确定结清账单将无法修改',
        showCancel: true, //是否显示取消按钮-----》false去掉取消按钮
        cancelText: "取消", //默认是“取消”
        cancelColor: '#409efe', //取消文字的颜色
        confirmText: "确定", //默认是“确定”
        confirmColor: '#f66b6e', //确定文字的颜色
        success(res) {
          if (res.cancel) {
            //点击取消
            console.log("您点击了取消")
          } else if (res.confirm) {
            //点击确定
            console.log("您点击了确定")
          }
        }
      })
    }
  },
  //结束账单--接口回调
  billStateUpdate(){
    return new Promise( (resolve, reject) => {
      util.ajax({
        //loading
        loading: () => {
          wx.showLoading({ title: '加载中', icon: 'loading' });
        },
        url: urlList.billStateUpdate,
        data: {
          "ids": [this.data.id],
          status: '-1',
        },
        method: 'post',
        success: (res) => {
          resolve(res)
        },
      })
    })
  },
  //确认结账
  bindSettleAccountsBox(e) {
    let self = this
    wx.showModal({
      title: '',
      content: '是否确认结账？',
      success(res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          self.billStateUpdate( (res) => {})
          .then(
            //点击确定
            wx.showToast({
              icon: 'success',  //图标，支持"success"、"loading" none
              title: '结账成功',
              success() {
                setTimeout(() => {
                  wx.switchTab({
                    url: '../index',
                  })
                }, 1000)
              }
            })
          )
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      basicData:{
        businessName: options.csname,//商家
        business: options.type == 1 ? '供应商' : '合作商', //商家名称
        stata: options.status,//账单状态
        billMoney: options.amount,
      },
      id: options.id,
    })
    wx.setNavigationBarTitle({
      title: '账单详情'  //修改title
    })
    this.getBillDetails(this.data.id)
    
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