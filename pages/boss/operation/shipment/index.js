// pages/boss/operation/shipment/index.js
var app = getApp();
import util from '../../../../utils/util.js'
import urlList from '../../../../api/api.js'
let userData = wx.getStorageSync('accountLogin')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    connentBoxWidth: '370',
    tableTrListHeight: 'auto',
    task: {
      id: '',
      index: 0, //任务下标，用于内页激活任务
      customerId: '', //商户主键
      list: [],
      total: 0, //任务总数
      pageNum: 1, //任务页码
      itemPage: 1, //品种列表页码
      itemTotal: 0, //品种总数
      noData: false,
      supplierName: '', //供应商名称
      itemData: [
        // { name: '红鸡蛋红鸡蛋红鸡蛋红鸡蛋红鸡蛋红鸡蛋红鸡蛋红鸡蛋', sign: '8', way: '包', realWeight: '43.6' },
      ]
    },
  },
  //头部 Tab 滚动宽度计算
  headerTabWidth() {
    let taskListLen = this.data.task.list.length,
      ids = [],
      tabWidthSum = 0
    for (let i = 0, len = taskListLen; i < len; i++) {
      ids.push('#id' + i)
    }
    app.getQueryNodes([...ids], (res) => {
      for (let i = 0, len = res.length; i < len; i++) {
        tabWidthSum += res[i].width
      }
      console.log(tabWidthSum)
      this.setData({
        connentBoxWidth: tabWidthSum
      })
    })

  },
  //table 内容可滚动区域计算
  tableTrScroll() {
    let winHeight, sumResHeight;
    app.windowScrollHeight((height) => {
      winHeight = height
    })
    app.getQueryNodes(['.headerBox', '.centerHeadBox', '.tableHead', '.loadingBox', '.footerBox'], (res) => {
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
      'task.itemPage': 1,
      'task.itemData': [],
      'task.itemTotal': 0,
      'task.customerId': allTaskList[index].cussupId
    })
    this.getShipmentGoodsList({
      // programId: this.data.programme.id,
      // supplierId: this.data.supplierList.id,
      taskId: this.data.task.list[index].id
    })
  },
  //取消出货接口
  cancelShipment() {
    util.ajax({
      //loading
      loading: () => {
        wx.showLoading({
          title: '加载中',
          icon: 'loading'
        });
      },
      url: urlList.cancelShipment,
      data: {
        id: this.data.task.id,
        status: '1',
      },
      method: 'post',
      success: (res) => {
        this.onLoad();
      },
    })
  },
  //取消当前出货任务
  bindCancelCurrentTask() {
    let task = this.data.task.list
    let self = this
    if (task.length > 0) {
      wx.showModal({
        title: '',
        content: '确定取消当前出货任务？',
        showCancel: true, //是否显示取消按钮-----》false去掉取消按钮
        cancelText: "否", //默认是“取消”
        cancelColor: '#409efe', //取消文字的颜色
        confirmText: "是", //默认是“确定”
        confirmColor: '#f66b6e', //确定文字的颜色
        success(res) {
          if (res.cancel) {} else if (res.confirm) {
            self.cancelShipment()
          }
        }
      })
    } else {
      wx.showToast({
        title: '暂无出货任务',
        icon: 'none',
        duration: 2000
      });
    }
  },
  //移除商品
  bindRemoveGoods(e) {
    let index = e.currentTarget.dataset.goodsindex, 
    itemData = this.data.task.itemData[index]
    console.log(itemData)
    wx.showModal({
      title: '',
      content: '确认删除该数据吗, 是否继续?',
      confirmText: '确定',
      confirmColor: '#67c239',
      success: (res) => {
        if (res.confirm) {
          util.ajax({
            completed: true,
            //loading
            loading: () => {
              wx.showLoading({
                title: '加载中',
                icon: 'loading'
              });
            },
            url: urlList.shipmentGoodsRemove,
            data: {
              taskId: this.data.task.id,
              customerId: this.data.task.customerId,
              goodsResponseList: [itemData]
            },
            method: 'post',
            success: (res) => {
              let data = res.data
              if (data.state === 1){
                wx.showToast({
                  title: '删除成功',
                  icon: 'none',
                  duration: 2000
                });
                this.data.task.itemData.splice(index, 1);
                let romoveAfter = this.data.task.itemData;
                this.setData({
                  'task.itemData': romoveAfter
                })
                if (romoveAfter.length === 0){
                  this.setData({
                    'task.noData': true
                  })
                }
              }else{
                wx.showToast({
                  title: '删除失败',
                  icon: 'none',
                  duration: 2000
                });
              }
            },
          })
        } else {
          wx.showToast({
            title: '已取消删除',
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  //出货结束
  finishShipmentTask(obj) {
    let self = this
    return new Promise((resolve, reject) => {
      util.ajax({
        completed: true,
        //loading
        loading: () => {
          wx.showLoading({
            title: '加载中',
            icon: 'loading'
          });
        },
        url: urlList.finishShipmentTask,
        data: {
          "cussupId": obj.cussupId,
          "id": this.data.task.id,
        },
        method: 'post',
        success: (res) => {
          let data = res.data,
            state = data.state,
            message = data.message
          if (state == -1) {
            wx.showToast({
              title: message,
              icon: 'none',
              duration: 2000
            });
            return
          }
          if (state == -2) {
            wx.showModal({
              title: '',
              content: '员工端暂未结束任务，是否强制结束？',
              confirmText: '确定',
              confirmColor: '#67c239',
              success: function(res) {
                if (res.confirm) {
                  self.bindToShipmentFinish('forceFinish')
                }
              }
            })
            return
          }
          resolve(res)
        },
      })
    })
  },
  //强制结束出货
  forceFinishShipmentTask(obj) {
    return new Promise((resolve, reject) => {
      util.ajax({
        completed: true,
        //loading
        loading: () => {
          wx.showLoading({
            title: '加载中',
            icon: 'loading'
          });
        },
        url: urlList.forceFinishShipmentTask,
        data: {
          "cussupId": obj.cussupId,
          "id": this.data.task.id,
        },
        method: 'post',
        success: (res) => {
          let data = res.data,
            state = data.state,
            message = data.message
          if (state == -1 || state == -2 || state == -3) {
            wx.showToast({
              title: message,
              icon: 'none',
              duration: 2000
            });
            return
          }
          resolve(res)
        },
      })
    })
  },
  //跳转卸货完成详情页
  bindToShipmentFinish(type) {
    let task = this.data.task
    let index = this.data.task.index
    if (task.list.length > 0) {
      if (type == 'forceFinish') {
        this.forceFinishShipmentTask({
          cussupId: task.list[index].cussupId
        }).then((res) => {
          wx.navigateTo({
            url: './shipment_finish/index?taskId=' + task.id + '&cussupName=' + task.list[index].cussupName + '&cussupId=' + task.list[index].cussupId,
          })
        })
      } else {
        this.finishShipmentTask({
          cussupId: task.list[index].cussupId
        }).then((res) => {
          wx.navigateTo({
            url: './shipment_finish/index?taskId=' + task.id + '&cussupName=' + task.list[index].cussupName + '&cussupId=' + task.list[index].cussupId,
          })
        })
      }
    } else {
      wx.showToast({
        title: '暂无出货任务',
        icon: 'none',
        duration: 2000
      });
    }

  },
  //获取出货任务列表
  getShipmentTaskList(obj) {
    return new Promise((resolve, reject) => {
      util.ajax({
        loadMore: obj.loadMore,
        total: this.data.task.total,
        loadedNum: this.data.task.list.length,
        pageNum: this.data.task.pageNum,
        //loading
        loading: () => {
          wx.showLoading({
            title: '加载中',
            icon: 'loading'
          });
        },
        url: urlList.unloadTaskList,
        data: {
          current: 1,
          size: 20,
          "type": "2",
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
          if (dataData && dataData.list.length != 0) {
            //为任务列表数据添加任务名称
            let list = dataData.list,
              pushList = this.data.task.list
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
              'task.noData': false,
            })
            obj.fn ? obj.fn(dataData) : obj.fn
            resolve(dataData)
          } else {
            this.setData({
              'task.noData': true,
            })
          }
          if (data.status == 400) {
            wx.showToast({
              title: '',
              icon: 'none',
              duration: 2000
            });
            reject(res)
          }
        },
      })
    })
  },
  //获取出货中的商品
  getShipmentGoodsList(obj) {
    util.ajax({
      loadMore: obj.loadMore,
      total: this.data.task.itemTotal,
      loadedNum: this.data.task.itemData.length,
      pageNum: this.data.task.itemPage,
      //loading
      loading: () => {
        wx.showLoading({
          title: '加载中',
          icon: 'loading'
        });
      },
      url: urlList.shipmentGoodsList,
      data: {
        "current": 1,
        "size": 20,
        "taskId": this.data.task.id,
        // "companyId": "string",
        // "createtime": "2019-05-18T10:26:17.315Z",
        // "creator": "string",
        // "current": 0,
        "customerId": this.data.task.customerId,
        // "goodsNo": "string",
        // "pages": 0,
        // "shopId": "string",
        // "size": 0,
        "sortType": 1,
        // "specificationId": "string",
        // "taskId": "string",
        // "total": 0
      },
      method: 'post',
      success: (res) => {

        let data = res.data
        let dataObj = data.data
        if (dataObj) {
          //计算预警个数
          let itemArr = dataObj
          if (itemArr.length == 0) {
            this.setData({
              'task.noData': true,
            })
          } else {
            this.setData({
              'task.noData': false,
            })
          }
          for (let i = 0, len = itemArr.length; i < len; i++) {
            let dataItem = itemArr[i]
            this.data.task.itemData.push(dataItem)
          }
          this.setData({
            'task.itemPage': this.data.task.itemPage + 1,
            'task.itemData': this.data.task.itemData,
            // 'task.itemTotal': dataObj.total
          })
        } else {
          this.setData({
            'task.noData': true,
          })
        }
      },
    })
  },
  //加载更多数据
  refreshListData(e) {
    let scrollSign = e.currentTarget.dataset.scroll
    //任务
    if (scrollSign === 'taskData') {
      this.getShipmentTaskList({
        loadMore: true,
        fn: () => {
          this.headerTabWidth()
        }
      })
    }

    //商品列表
    if (scrollSign === 'taskItemData') {

    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideTabBar({})
    wx.setNavigationBarTitle({
      title: '出货中'
    })
    this.tableTrScroll()

    this.getShipmentTaskList({
      // fn: () => {}
    }).then((res) => {
      let list = res.list
      this.headerTabWidth()
      this.setData({
        'task.id': list[0].id,
        'task.index': 0,
        'task.customerId': list[0].cussupId
      })
      //设置taskId
      if (list.length != 0) {
        this.getShipmentGoodsList({

        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // this.headerTabWidth()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.getShipmentTaskList({
    //   fn: (res) => {
    //     this.headerTabWidth()
    //     let data = res.list
    //     if (data.length > 0){
    //       this.setData({
    //         'task.id': data[0].id
    //       })
    //       this.getShipmentGoodsList({
    //         taskId: data[0].id,
    //         fn: (res) => {
    //           this.setData({
    //             'task.itemData': res.records,
    //             'task.itemTotal': res.total
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})