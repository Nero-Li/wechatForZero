// pages/boss/operation/disburden/classify/index.js
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
      itemData: {
        varietyDetails:[
          // { name: '红鸡蛋', unit:'箱', programmeList:
          //   [
          //     { sign: '8', number: 60 },
          //     { sign: '8-', number: 70 },
          //     { sign: '48', number: 50 }
          //   ]
          // },
        ],
        totalData:[
          {total:360,alert:2,unit:'箱'}
        ],
        // varietyData:[
        //   { name: '红鸡蛋', programme: [60,70,50], unit: '箱'},
        // ]
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
      if (index) {
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
    app.getQueryNodes(['.headerBox', '.centerHeadBox','.loadingBox'], (res) => {
      for (let i = 0, len = res.length; i < len; i++) {
        sumResHeight += res[i].height
      }
      this.setData({
        tableTrListHeight: (winHeight - sumResHeight) + 'px'
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
    console.log(state)
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
    this.getClassifyDetails({})
    // console.log(this.data.task)
  },
  //取消当前卸货任务
  bindCancelCurrentTask() {
    let self = this
    wx.showModal({
      title: '',
      content: '确定取消当前卸货任务？',
      showCancel: true, //是否显示取消按钮-----》false去掉取消按钮
      cancelText: "否", //默认是“取消”
      cancelColor: '#409efe', //取消文字的颜色
      confirmText: "是", //默认是“确定”
      confirmColor: '#f66b6e', //确定文字的颜色
      success(res) {
        if (res.cancel) {
          //点击取消
          console.log("您点击了取消")
        } else if (res.confirm) {
          //点击确定
          console.log("您点击了确定")
          self.updateTaskState(self.data.task.id)
        }
      }
    })
  },
  //跳转卸货列表
  bindToDisburdenList() {
    wx.navigateBack({
      delta: 1
    })
  },
  //跳转卸货完成详情页
  bindToDisburdenFinish() {
    wx.navigateTo({
      url: './disburden_finish/index',
    })
  },
  //获取卸货任务列表
  getUnloadTaskList(obj) {
    util.ajax({
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.unloadTaskList,
      data: {
        current: 1,
        size: 20,
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
        // "type": "string"
      },
      method: 'post',
      success: (res) => {
        console.log(res)
        let data = res.data
        let dataData = data.data
        let taskData = this.data.task
        if (dataData) {
          this.setData({
            'task.total': dataData.total
          })
          //为任务列表数据添加任务名称
          let list = dataData.list
          for (let i = 0, len = list.length; i < len; i++) {
            let item = list[i]
            list[i].name = util.toChinesNum(i + 1)
            list[i].active = false
            list[taskData.index].active = true
          }
          obj.fn(dataData)
        }
        if (data.status == 400) {
          wx.showToast({ title: '', icon: 'none', duration: 2000 });
        }
      },
    })
  },
  //更新取消卸载任务状态
  updateTaskState(obj) {
    util.ajax({
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.changeProgram + '?active=false&&taskId=' + obj.taskId,
      data: {
        // "active": true,
        // "id": "string",
        // "programId": "string",
        // "taskId": "string"
      },
      method: 'post',
      success: (res) => {
        wx.showToast({ title: '取消成功', icon: 'none', duration: 2000, mask: true });
        setTimeout(() => {
          wx.switchTab({
            url: '../operation/index',
          })
        }, 1000)
      },
    })
  },
  //根据任务Id获取归类商品详情
  getClassifyDetails(obj){
    util.ajax({
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.queryUnloadGoods,
      data: {
        "taskId": this.data.task.id,
       
        // "companyId": "string",
        // "goodsCategoryId": "string",
        // "goodsNo": "string",
        // "id": "string",
        // "marker": "string",
        // "mode": "string",
        // "programId": "string",
        // "remark": "string",
        // "shopId": "string",
        // "supplierId": "string",
        // "taskId": "string",
        // "unloadTime": "string",
        // "warn": true,
        // "weight": 0
       
      },
      method: 'post',
      success: (res) => {
        let data = res.data
        let dataData = data.data, listJSON = [], listArr = []
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

          let map = {}, dest = [];
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
            noData: false
          })
        } else {
          this.setData({
            'task.itemData.varietyDetails': [],
            noData: true
          })
        }
      },
    })
  },
  //加载更多数据事件回调
  refreshListData(e) {
    console.log(e)
    let scrollSign = e.currentTarget.dataset.scroll
    //任务
    if (scrollSign === 'taskData') {
      
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.tableTrScroll()
    console.log('options', options)
    this.setData({
      'task.id': options.id
    })
    wx.hideTabBar({})
    wx.setNavigationBarTitle({
      title: '整理归类'
    })
    wx.getStorage({
      key: 'taskDataList',
      success: (res) => {
        this.setData({
          'task.list': res.data,
        })
        this.headerTabWidth(options.index)
      }
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
    //     let data = res.list
    //     this.setData({
    //       'task.list': data
    //     })
    //     this.headerTabWidth()
    //     //设置taskId
    //     this.setData({
    //       'task.id': data[0].id,
    //       'task.index': this.data.task.index
    //     })
    //     this.getClassifyDetails({
    //       // taskId: data[0].id
    //       taskId: '1'
    //     })
    //   }
    // })
    this.getClassifyDetails({})
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