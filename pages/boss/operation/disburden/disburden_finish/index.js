// pages/boss/operation/disburden/disburden_finish/index.js
let app = getApp();
import util from '../../../../../utils/util.js'
import urlList from '../../../../../api/api.js'
let userData = wx.getStorageSync('accountLogin')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    connentBoxWidth: '370',
    tableTrListHeight: 'auto',
    showChooseProgramme: false,
    noData: false,
    task: {
      id: '',
      index: 0,// 任务下标
      list: [],
      total: 0,//任务总数
      pageNum: 1,//任务页码
      itemPage: 0,//品种列表页码
      itemTotal: 0,//品种总数
      supplierName: '',//供应商名称
      itemData: {
        varietyDetails: [
          // {
          //   name: '红鸡蛋', unit: '箱', unEdit: true, programmeList:
          //     [
          //       { price: '8', number: 60, total: 2000, unit: '元' },
          //       { price: '8', number: 60, total: 2000, unit: '元' },
          //       { price: '8', number: 60, total: 2000, unit: '元' },
          //     ]
          // },
        ],
        totalData: { total: 0, alert: 0 ,sumPrice: 0},
      }

    },
  },
  //头部 Tab 滚动宽度计算
  headerTabWidth(index) {
    let taskListLen = this.data.task.list.length, ids = [], tabWidthSum = 0
    for (let i = 0, len = taskListLen; i < len; i++) {
      ids.push('#id' + i)
    }
    app.getQueryNodes([...ids], (res) => {
      for (let i = 0, len = res.length; i < len; i++) {
        tabWidthSum += res[i].width
      }
      this.setData({
        connentBoxWidth: tabWidthSum
      })
      if(index){
        this.setData({
          'task.index': index
        })
      }
    })

  },
  //table 内容可滚动区域计算
  tableTrScroll() {
    let winHeight = 0, sumResHeight = 0;
    app.windowScrollHeight((height) => { winHeight = height })
    app.getQueryNodes(['.headerBox', '.centerHeadBox', '.footerBox'], (res) => {
      for (let i = 0, len = res.length; i < len; i++) {
        sumResHeight += res[i].height
      }
      this.setData({
        tableTrListHeight: (winHeight - sumResHeight - 20) + 'px'
      })
    })
  },
  // 绑定切换任务事件
  bindTabTask(e) {
    let state = e.currentTarget.dataset.state,
      splitArr = state.split('_'),
      index = splitArr[0],
      active = JSON.parse(splitArr[1]),
      allTaskList = this.data.task.list
    // 设置前需将所有任务的状态重置
    for (let i = 0, len = allTaskList.length; i < len; i++) {
      this.setData({
        ['task.list[' + i + '].active']: false
      })
    }
    this.setData({
      ['task.list[' + index + '].active']: true,
      'task.id': allTaskList[index].id,
      'task.index': index,
    })
    this.getQueryUnloadGoods({
      taskId: this.data.task.list[index].id
    })
  },
  //绑定单价编辑图标事件
  bindEditInput(e){
    let unedit = e.currentTarget.dataset.unedit
    let index = e.currentTarget.dataset.index
    let list = this.data.task.itemData.varietyDetails[index].item
    for(let i = 0, len = list.length;i < len ;i++){
      let item = list[i]
      this.setData({
        ['task.itemData.varietyDetails[' + index + '].item[' + i + '].unEdit']: !unedit,
      })
     
    }
    this.setData({
      ['task.itemData.varietyDetails[' + index + '].unEdit']: !unedit,
    })

    
  },
  //绑定编辑单价并更新小计
  bindUpdateValue(e) {
    let value = e.detail.value,//获取列表对应的值
      dataIndex = e.currentTarget.dataset.dataindex,//获取列表对应的data[]下标
      lItemIndex = e.currentTarget.dataset.litemindex //获取列表对应的下标
    let sumPrice = 0, data = this.data.task.itemData.varietyDetails
    this.setData({
      ['task.itemData.varietyDetails[' + dataIndex + '].item[' + lItemIndex + '].price']: value,
    })

    for (let i = 0, len = data.length; i < len; i++){
      let item = data[i].item
      for (let j = 0, il = item.length; j < il; j++){
        // console.log(item[j])
        sumPrice += item[j].price * item[j].sumVal
      }
    }
    this.setData({
      ['task.itemData.totalData.sumPrice']: sumPrice,
    })

  },
  //获取卸货任务列表
  getUnloadTaskList(obj) {
    util.ajax({
      loadMore: obj.loadMore,
      total: this.data.task.total,
      loadedNum: this.data.task.list.length,
      pageNum: this.data.task.pageNum,
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.unloadTaskList,
      data: {
        current: 1,
        size: 20,
        "type": "1",
        "status": "0",
        // equipmentNo:''
        // "companyId": "string",
        // "current": 0,
        // "equipmentNo": "string",
        // "pages": 0,
        // "shopId": "string",
        // "size": 0,
        // "status": "string",
        // "supplierId": "string",
        // "total": 0,
      },
      method: 'post',
      success: (res) => {
        console.log(res)
        let data = res.data
        let dataData = data.data
        console.log('dataData', dataData.list)
        if (dataData && dataData.list.length != 0) {
          //为任务列表数据添加任务名称
          let list = dataData.list, pushList = this.data.task.list
          for (let i = 0, len = list.length; i < len; i++) {
            let item = list[i]
            pushList.push(item)
          }
          for (let i = 0, len = pushList.length; i < len; i++) {
            let item = pushList[i]
            item.name = util.toChinesNum(i + 1)
            item.active = false
          }
          this.setData({
            'task.total': dataData.total,
            ['task.list[' + this.data.task.index + '].active']: true,
            'task.pageNum': this.data.task.pageNum + 1,
            'task.list': pushList
          })
          obj.fn(dataData)
        }
        if (data.status == 400) {
          wx.showToast({ title: '', icon: 'none', duration: 2000 });
        }
      },
    })
  },
  //获取完成详情
  getQueryUnloadGoods(obj){
    util.ajax({
      loadMore: obj.loadMore,
      total: this.data.task.total,
      loadedNum: this.data.task.list.length,
      pageNum: this.data.task.pageNum,
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.queryUnloadGoods,
      data: {
        // current: 1,
        // size: 20,
        taskId: obj.taskId,
        // "companyId": "string",
        // "goodsCategoryId": "string",
        // "goodsNo": "string",
        // "id": "string",
        // "marker": "string",
        // "mode": "string",
        // "programId": "string",
        // "remark": "string",
        // "shopId": "string",
        // "specificationId": "string",
        // "supplierId": "string",
        // "unloadTime": "string",
        // "warn": true,
        // "weight": 0
      },
      method: 'post',
      success: (res) => {
        let data = res.data
        let dataData = data.data,listJSON = [],listArr = []
        if (dataData && dataData.list.length != 0) {
          let list = dataData.list, totalNumber = 0, sumPrice = 0, sumWarNum = 0
          for (let i = 0, len = list.length; i < len; i++) {
            let item = list[i]
            totalNumber += item.sumVal
            item.unEdit = true
            item.price = ''
            sumPrice += item.price * item.sumVal
            sumWarNum += item.warNum
          }

          let map = {},dest = [];
          for (let i = 0; i < list.length; i++) {
            let ai = list[i];
            if (!map[ai.goodsCategoryId]) {
              dest.push({
                goodsCategoryId: ai.goodsCategoryId,
                name: ai.name,
                unEdit: ai.unEdit,
                item: [ai]
              });
              map[ai.goodsCategoryId] = ai;
              map[ai.name] = ai;
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
          console.log(dest)
          this.setData({
            'task.itemData.varietyDetails': dest,
            'task.itemData.totalData.sumPrice': sumPrice,
            'task.itemData.totalData.total': totalNumber,
            'task.itemData.totalData.alert': sumWarNum,
            noData: false,
          })
        }else{
          this.setData({
            'task.itemData.varietyDetails': [],
            noData: true
          })
        }
      },
    })
  },
  //确认结束卸货
  bindFinish(){
    let parame = [], list = this.data.task.itemData.varietyDetails
    for (let i = 0, len = list.length; i < len; i++){
      let item = list[i]
      if (item.price == ''){
        wx.showToast({ title: '单价填写全', icon: 'none', duration: 2000, mask: true });
        return
      }
      parame.push({
        "goodsCategoryId": item.id,
        "programId": item.programId,
        "price": item.price,
        "quantity": item.sumVal,
        "specificationId": item.specificationId,
      })
    }
    util.ajax({
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.unloadTaskState,
      data: {
        // "categoryname": "string",
        // "companyId": "string",
        // "equipmentNo": "string",
        "id": this.data.task.id,
        // "programId": "string",
        // "programName": "string",
        // "remark": "string",
        // "shopId": "string",
        "status": '2',
        // "statusName": "string",
        // "supplierId": "string",
        // "suppliername": "string",
        // "typeName": "string",
        "unloadDetails": parame,
        // [

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
        //]
      },
      method: 'post',
      success: (res) => {
        wx.showToast({ title: '取消成功', icon: 'none', duration: 2000, mask: true });
        obj.fn()
      },
    })
  },
  //打印凭证
  bindToPrintVoucher(){

  },
  //加载更多数据事件回调
  refreshListData(e) {
    // console.log(e)
    let scrollSign = e.currentTarget.dataset.scroll
    //任务
    if (scrollSign === 'taskData') {
      this.getUnloadTaskList({
        loadMore: true,
        fn: () => {
          this.headerTabWidth()
        }
      })
    }

    //品种列表
    if (scrollSign === 'varietyList') {
      
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.hideTabBar({})
    wx.setNavigationBarTitle({
      title: '卸货完成详情'
    })
    this.tableTrScroll()
    wx.getStorage({
      key: 'taskDataList',
      success: (res) => {
        this.setData({
          'task.list': res.data,
        })
        this.headerTabWidth(options.index)
      }
    })
    this.setData({
      'task.id': options.id
    })
    this.getQueryUnloadGoods({
      taskId: this.data.task.id
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
    // this.getUnloadTaskList({
    //   fn: res => {
    //     let list = res.list
    //     this.headerTabWidth()
    //     this.setData({
    //       'task.id': list[0].id,
    //       'task.index': 0,
    //     })
    //     //设置taskId
    //     if (list.length != 0) {
    //       // this.getUnloadGoodsList({
    //       //   taskId: list[0].id,
    //       //   // taskId:'1',
    //       //   // shopId: 1,
    //       //   // unloadTime:'2019-04-04',
    //       //   otherData: '',
    //       // })
    //     }
    //   }
    // })
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