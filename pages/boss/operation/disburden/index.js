// pages/boss/operation/disburden/index.js
import util from '../../../../utils/util.js'
import urlList from '../../../../api/api.js'
let app = getApp();
let userData = wx.getStorageSync('accountLogin')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parentIndex:'',
    propIndex:'',
    categoryId:'',
    supplierList:{
      id: null,//供应商id
      total: 0,
      pageNum: 1,
      list:[
        { name: '请选择', id: null }
      ]
    },//供应商列表
    isShow:false,
    connentBoxWidth:'370',
    tableTrListHeight:'auto',
    showChooseProgramme:false,
    programme:{
      id: null,//方案id
      category: {
        total: 0,
        pageNum: 1,
        list: [
          { name: '请选择', id: null }
        ]
      },//品种列表
      list:[
        { name: '请选择', id: null }
        // { name: '方案一', active: true },
      ],
    },
    task:{
      add: false,
      id:'',
      index:0,//任务下标，用于内页激活任务
      list:[],
      total:0,//任务总数
      pageNum:1,//任务页码
      itemPage:1,//品种列表页码
      itemTotal:0,//品种总数
      warnNumber:0,//预警数
      noData:false,
      supplierName:'',//供应商名称
      itemData:[
        // { name: '红鸡蛋红鸡蛋红鸡蛋红鸡蛋红鸡蛋红鸡蛋红鸡蛋红鸡蛋', sign: '8', way: '包', realWeight:'43.6'},
      ]
    },
  },
  //头部 Tab 滚动宽度计算
  headerTabWidth(index){
    let taskListLen = this.data.task.list.length, ids = [], tabWidthSum = 0
    for (let i = 0, len = taskListLen; i < len; i++){
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
  tableTrScroll(){
    let winHeight = 0,sumResHeight = 0;
    app.windowScrollHeight((height) => { winHeight = height })
    app.getQueryNodes(['.headerBox', '.centerHeadBox', '.tableHead', '.loadingBox', '.footerBox', '.alertNumber'], (res) => {
      for(let i = 0, len = res.length; i < len; i++){
        sumResHeight += res[i].height
      }
      this.setData({
        tableTrListHeight: (winHeight - sumResHeight- 20) + 'px'
      })
    })
  },
  // 绑定切换任务事件
  bindTabTask(e){
    let state = e.currentTarget.dataset.state,self = this,
      splitArr = state.split('_'),
      index = splitArr[0],
      active = JSON.parse(splitArr[1]),
      allTaskList = this.data.task.list,
      categoryList = this.data.programme.category.list,
      programmeList = this.data.programme.list
      // 设置前需将所有任务的状态重置
    for (let i = 0 , len = allTaskList.length ; i < len ;i++){
      this.setData({
        ['task.list[' + i + '].active']: false
      })
    }
    // console.log(this.data.programme.category.list)
    // console.log(this.data.programme.list)
    this.setData({
      ['task.list[' + index + '].active']: true,
      'task.id': allTaskList[index].id,
      'task.index': index,
      'task.itemPage': 1,
      'task.itemData': [],
      'task.warnNumber': 0,
      'task.itemTotal': 0,
      categoryId: allTaskList[index].categoryId
    })
    // this.getProgrammeList({
    //   categoryId: this.data.categoryId
    // })
    if (allTaskList[index].id != ''){
      this.getUnloadGoodsList({
        programId: this.data.programme.id,
        supplierId: this.data.supplierList.id,
        taskId: this.data.task.list[index].id
      })
    }

    this.getListEggType({
      fn: (res) => {
        this.getProgrammeList({
          categoryId: self.data.categoryId
        })
      }
    })
    // this.setData({
    //   parentIndex: 4,
    //   propIndex: 1
    // })
  },
  //添加卸货任务
  bindAddTask(){
    let task = this.data.task,list = task.list
    if (task.add){
      wx.showToast({ title: '已有还未开始的卸货任务', icon: 'none', duration: 2000 });
    }else{
      list.push({
        cussupName: '新任务', id: '', active:false
      })
      this.setData({
        'task.add': true,
        'task.list': list,
        'task.itemData': [],
        'task.noData':true,
        parentIndex: 0,
        'programme.list': [{ name: '请选择', id: null}],
        propIndex: 0
      })
      this.headerTabWidth(list.length - 1)
      
      for (let i = 0, len = list.length; i < len; i++) {
        this.setData({
          ['task.list[' + i + '].active']: false,
        })
      }
      this.setData({
        ['task.list[' + (list.length - 1) + '].active']: true
      })
    }
  },
  //取消、暂停当前卸货任务
  bindCancelCurrentTask(e){
    let type = e.currentTarget.dataset.type
    let self = this, content = '', status = ''
    console.log(type)
    // return
    //取消
    if (type === 'cancel'){
      content = '取消', status = '1'
    }
    //暂停
    if (type === 'suspend') {
      content = '暂停', status = '3'
    }
    //继续
    if (type === 'continue'){
      content = '继续', status = '0'
    }
    wx.showModal({
      title: '',
      content: '确定' + content + '当前卸货任务？',
      showCancel: true, //是否显示取消按钮-----》false去掉取消按钮
      cancelText: "否", //默认是“取消”
      cancelColor: '#409efe', //取消文字的颜色
      confirmText: "是", //默认是“确定”
      confirmColor: '#f66b6e', //确定文字的颜色
      success(res) {
        if (res.cancel) {
          //点击取消
        } else if (res.confirm) {
          //点击确定
          let taskData = self.data.task
          /**
           * id:'',
            index:0,//任务下标，用于内页激活任务
            list:[],
            total:0,//任务总数
            pageNum:1,//任务页码
            itemPage:1,//品种列表页码
            itemTotal:0,//品种总数
            warnNumber:0,//预警数
            noData:false,
            supplierName:'',//供应商名称
            itemData:[
           * 
           * */ 
          
          self.updateTaskState({
            status,
            data: [],
            fn: () => {
              self.setData({
                task: {
                  id: '',
                  index: 0,//任务下标，用于内页激活任务
                  list: [],
                  total: 0,//任务总数
                  pageNum: 1,//任务页码
                  itemPage: 1,//品种列表页码
                  itemTotal: 0,//品种总数
                  warnNumber: 0,//预警数
                  noData: false,
                  supplierName: '',//供应商名称
                  itemData: []
                }
              })
              self.getListEggType({
                fn: (res) => {

                }
              })
              self.getUnloadTaskList({
                // fn: () => {}
              }).then((res) => {
                let list = res.list
                self.headerTabWidth()
                self.setData({
                  'task.id': list[0].id,
                  'task.index': 0,
                })
                //设置taskId
                if (list.length != 0) {
                  self.getUnloadGoodsList({
                    taskId: list[0].id,
                    otherData: '',
                  })
                }
              })
            }
          })
        }
      }
    })
  },
  //开始卸货
  bindStartTask(){
    let cussupId = this.data.supplierList.id,
      programId = this.data.programme.id
    // console.log('cussupId',cussupId)
    // console.log('programId',programId)
    if (cussupId == null ){
      wx.showToast({ title: '请选择供应商', icon: 'none', duration: 2000 });
      return
    }
    if (programId == null) {
      wx.showToast({ title: '请选择方案', icon: 'none', duration: 2000 });
      return
    }
    
    util.ajax({
      // completed: true,
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.unloadAdd,
      data: {
        cussupId,programId
      },
      method: 'post',
      success: (res) => {
        this.setData({
          'task.list': [],
          'task.id': '',
          'task.index': 0,
          'task.itemPage': 1,
          'task.itemData': [],
          'task.warnNumber': 0,
          'task.itemTotal': 0
        })
        this.getUnloadTaskList({
          // fn: () => {}
        }).then((res) => {
          let list = res.list
          this.headerTabWidth()
          this.setData({
            'task.id': list[0].id,
            'task.index': 0,
          })
          //设置taskId
          if (list.length != 0) {
            this.getUnloadGoodsList({
              taskId: list[0].id,
              otherData: '',
            })
          }
        })
      },
    })
  },
  //跳转整理归类
  bindToClassify(){
    let taskData = this.data.task, list = taskData.list, listArr = []
    for (let i = 0, len = list.length; i < len; i++) {
      let item = list[i]
      if (item.id != '') {
        listArr.push(item)
      }
    }
    wx.setStorage({
      key: 'taskDataList',
      data: listArr
    })
    wx.navigateTo({
      url: './classify/index' + '?index=' + taskData.index + '&id=' + taskData.id,
    })
  },
  //跳转卸货完成详情页
  bindToDisburdenFinish(){
    let taskData = this.data.task, list = taskData.list,listArr = []
    for (let i = 0, len = list.length; i < len; i++){
      let item = list[i]
      if(item.id != ''){
        listArr.push(item)
      }
    }
    wx.setStorage({
      key: 'taskDataList',
      data: listArr
    })
    wx.navigateTo({
      url: './disburden_finish/index' + '?index=' + taskData.index + '&id=' + taskData.id,
    })
  },
  //获取卸货任务列表
  getUnloadTaskList(obj){
    return new Promise((resolve, reject) => {
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
          "status": "0,3",
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
            this.setData({
              'task.noData': false,
            })
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
              'task.list': pushList,
              categoryId: pushList[this.data.task.index].categoryId
            })
            obj.fn ? obj.fn(dataData) : obj.fn
            resolve(dataData)
          }else{
            this.setData({
              'task.noData': true,
            })
          }
          if (data.status == 400) {
            wx.showToast({ title: '', icon: 'none', duration: 2000 });
            reject(res)
          }
        },
      })
    })
  },
  //获取供应商列表
  getSupplierList(obj){
    util.ajax({
      loadMore: obj.loadMore,
      total: this.data.supplierList.total,
      loadedNum: this.data.supplierList.list.length,
      pageNum: this.data.supplierList.pageNum,
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.getSupplierList,
      data: {
        // "companyId": "string",
        "current": 1,
        // "pages": 1,
        // "programId": "string",
        // "shopId": "string",
        "size": 20,
        // "supplierId": "string",
        // "taskId": obj.taskId,
        // "total": 0,
        // "warn": true
      },
      method: 'post',
      success: (res) => {

        let data = res.data
        let dataObj = data.data, list = dataObj.list
        for (let i = 0, len = list.length; i < len; i++) {
          let dataItem = list[i]
          this.data.supplierList.list.push(dataItem)
        }
        // total: 0,
        // pageNum: 1,
        // console.log('list11', dataObj)
        this.setData({
          'supplierList.total': dataObj.total,
          'supplierList.pageNum': this.data.supplierList.pageNum + 1,
          'supplierList.list': this.data.supplierList.list
        })
      },
    })
  },
  //获取品种列表
  getListEggType(obj){
    util.ajax({
      loadMore: obj.loadMore,
      total: this.data.programme.category.total,
      loadedNum: this.data.programme.category.list.length,
      pageNum: this.data.programme.category.pageNum,
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.getListEggType,
      data: {
        // "companyId": "string",
        "current": this.data.programme.category.pageNum,
        // "pages": 1,
        // "programId": "string",
        // "shopId": "string",
        "size": 100,
        // "supplierId": "string",
        // "taskId": obj.taskId,
        // "total": 0,
        // "warn": true
      },
      method: 'post',
      success: (res) => {
        let data = res.data
        let dataObj = data.data
        setTimeout( () => {
          obj.fn(dataObj)
        })
        let categoryList = dataObj.categoryList, list = this.data.programme.category.list
        for (let i = 0, len = categoryList.length; i < len; i++) {
          let dataItem = categoryList[i]
          this.data.programme.category.list.push(dataItem)
        }
        for (let i = 0, len = list.length; i < len; i++){
          let item = list[i]
          if (item.id == this.data.categoryId){
            // console.log('parentIndex',i)
            this.setData({
              parentIndex: i,
            })
          }
        }
        this.setData({
          'programme.category.pageNum': this.data.programme.category.pageNum + 1,
          'programme.category.total': dataObj.total,
          'programme.category.list': this.data.programme.category.list
        })
      },
    })
  },
  //根据品种id获取方案
  getProgrammeList(obj){
    if (!obj.categoryId){
      let pList = [{ name: '请选择', id: null }]
      this.setData({
        'programme.list': pList
      })
      return
    }
    util.ajax({
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.getListStandard,
      data: {
        "current": 1,
        "size": 100,
        "categoryId": obj.categoryId,
        // "companyId": "string",
        // "createtime": "2019-05-11T15:51:42.481Z",
        // "creator": "string",
        // "dr": 0,
        // "id": "string",
        // "modifier": "string",
        // "modifytime": "2019-05-11T15:51:42.481Z",
        // "name": "string",
        // "shopId": "string"
      },
      method: 'post',
      success: (res) => {
        let data = res.data
        let dataObj = data.data
        this.setData({
          'programme.list': dataObj
        })
        let programmeList = dataObj, list = this.data.programme.list
        for (let i = 0, len = list.length; i < len; i++) {
          let item = list[i]
          
          if (item.id === this.data.programme.id) {
            console.log('console.log(this.data.programme.id)',i)
            this.setData({
              propIndex: i,
            })
          }
        }
      },
    })
  },
  //获取选中的供应商数据
  onSupplierItem(e) {
    let item = e.detail
    this.setData({
      'task.itemPage': 1,
      'task.itemData': [],
      'task.warnNumber': 0,
      'task.itemTotal': 0,
      'supplierList.id': item.id
    })
    if (item.id){
      this.getUnloadGoodsList({
        programId: this.data.programme.id,
        supplierId: this.data.supplierList.id,
        taskId: this.data.task.id
      })
    }else{
      this.getUnloadGoodsList({
        taskId: this.data.task.id
      })
    }
  },
  //获取选方案的选中品种的数据
  onCategoryItem(e){
    console.log('onCategoryItem',e)
    let categoryId = e.detail.id
    this.getProgrammeList({
      categoryId
    })
  },
  //获取选方案的选中方案的数据
  onProgrammeItem(e) {
    let item = e.detail
    // console.log(item)
    this.setData({
      'task.itemPage': 1,
      'task.itemData': [],
      'task.warnNumber': 0,
      'task.itemTotal': 0,
      'programme.id': item.id
    })
    if (item.id) {
      this.getUnloadGoodsList({
        programId: this.data.programme.id,
        supplierId: this.data.supplierList.id,
        taskId: this.data.task.id
      })
    } else {
      this.getUnloadGoodsList({
        taskId: this.data.task.id
      })
    }
  },
  //获取卸载任务的方案
  getUnloadTaskProgramList(obj) {

  },
  //获取分页查询卸货商品
  getUnloadGoodsList(obj){
    util.ajax({
      loadMore: obj.loadMore,
      total: this.data.task.itemTotal,
      loadedNum: this.data.task.itemData.length,
      pageNum: this.data.task.itemPage,
      //loading
      loading: () => {
        if (obj.loadMore) {
          this.setData({
            isShow: true
          })
        }
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.unloadList,
      data: {
        // "companyId": "string",
        "current": 1,
        // "pages": 1,
        "programId": obj.programId ? obj.programId : null,
        // "shopId": "string",
        "size": 20,
        "supplierId": obj.supplierId ? obj.supplierId : null,
        "taskId": obj.taskId,
        // "total": 0,
        // "warn": true
      },
      method: 'post',
      success: (res) => {
        this.setData({
          isShow: false
        })
        let data = res.data
        let dataObj = data.data, totaldata = data.totaldata
        if (dataObj){
          //计算预警个数
          let itemArr = dataObj.list,warnCompute = 0
          if (itemArr.length == 0){
            this.setData({
              'task.noData':true,
            })
          }else{
            this.setData({
              'task.noData': false,
            })
          }
          for (let i = 0, len = itemArr.length; i < len; i++){
            let dataItem = itemArr[i]
            if (dataItem.warn){
              this.data.task.warnNumber = this.data.task.warnNumber + 1
            }
            this.data.task.itemData.push(dataItem)
          }
          /*
          this.setData({
      'task.itemPage': 1,
      'task.itemData': [],
      'task.warnNumber': 0,
      'task.itemTotal': 0,
      'programme.id': item.id
    })
          */
          this.setData({
            'task.itemPage': this.data.task.itemPage + 1,
            'task.itemData': this.data.task.itemData,
            'task.warnNumber': this.data.task.warnNumber,
            'task.itemTotal': dataObj.total,
            'programme.id': totaldata.programId,
          })
        }
      },
    })
  },
  //更新卸载任务状态
  updateTaskState(obj){
    // obj.data
    // console.log(obj.data)
    // return
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
        "status": obj.status,
        // "statusName": "string",
        // "supplierId": "string",
        // "suppliername": "string",
        // "typeName": "string",
        "unloadDetails": obj.data,
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
        wx.showToast({ title: '取消成功', icon: 'none', duration: 2000 ,mask: true });
        obj.fn()
      },
    })
  },
  //加载更多数据事件回调
  refreshListData(e) {
    let scrollSign = e.currentTarget.dataset.scroll
    let selectType = e.detail.name, scrollType = e.detail.scroll
    //任务
    if (scrollSign === 'taskData') {
      this.getUnloadTaskList({
        loadMore: true,
        fn: () => { 
          this.headerTabWidth()
        }
      })
    }
    //商品列表
    if (scrollSign === 'taskItemData') {
      this.getUnloadGoodsList({
        loadMore: true,
        fn: () => { },
        programId: this.data.programme.id,
        supplierId: this.data.supplierList.id,
        taskId: this.data.task.id,
      })
    }

    //选择项加载更多
    if (selectType === 'childrenlist'){
      //加载更多供应商
      if (scrollType === 'aloneselect'){
        this.getSupplierList({
          loadMore: true,
          fn: () => { }
        })
      }
      //加载更多方案
      if (scrollType === 'moreselect') {
        
      }
    }
    //加载更多品种
    if (selectType === 'parentlist') {
      this.getListEggType({
        loadMore: true,
        fn: () => {}
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar({})
    wx.setNavigationBarTitle({
      title:'卸货中'
    })
    this.tableTrScroll()
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
    let self = this
    this.getSupplierList({})
    this.getListEggType({
      fn: (res) => {
        self.getProgrammeList({
          categoryId: self.data.categoryId
        })
      }
    })
    this.getUnloadTaskList({
      // fn: () => {}
    }).then((res) => {
      let list = res.list
      this.headerTabWidth()
      this.setData({
        'task.id': list[0].id,
        'task.index': 0,
      })
      //设置taskId
      if (list.length != 0) {
        this.getUnloadGoodsList({
          taskId: list[0].id,
          otherData: '',
        })
      }
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