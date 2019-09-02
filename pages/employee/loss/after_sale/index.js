// pages/employee/loss/after_sale/index.js
import util from '../../../../utils/util.js'
import urlList from '../../../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabHeadArr:[
      {
        name: '全部',
        active:true,
      },
      {
        name: '待售后',
        active: false,
      },
      {
        name: '售后中',
        active: false,
      },
      {
        name: '完成售后',
        active: false,
      },
    ],
    listArr: [],
    total: 0,
    pageNum:1,
    noData: false,
    status: '',
    id:'',
    brokenGoodsNo: '',
    changeGoodsNo: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的售后'  //修改title
    })
    this.getBrokenTask({
      status: ''
    })
  },
  //跳转条码信息
  bindToBarCode() {
    wx.navigateTo({
      url: './details/index',
    })
  },
  //点击切换
  bindTabH(e){
    let index = e.currentTarget.dataset.index,tabTitle = this.data.tabHeadArr
    tabTitle.map((item,i) => {
      this.setData({
        ['tabHeadArr.[' + i + ']active']: false
      })
    })
    this.setData({
      ['tabHeadArr.[' + index + ']active'] : true
    })
    this.setData({
      pageNum: 1,
      total: 0,
      listArr: [],
    })
    if(index === 0){
      this.setData({
        status: ''
      })
      this.getBrokenTask({
        status: this.data.status
      })
    }
    if (index === 1) {
      this.getBrokenTask({
        status: '1'
      })
    }
    if (index === 2) {
      this.setData({
        status: '0'
      })
      this.getBrokenTask({
        status: this.data.status
      })
    }
    if (index === 3) {
      this.setData({
        status: '-1'
      })
      this.getBrokenTask({
        status: this.data.status
      })
    }
  },
  //查询报损列表
  getBrokenTask(obj) {
    util.ajax({
      loadMore: obj.loadMore,
      total: this.data.total,
      loadedNum: this.data.listArr.length,
      pageNum: this.data.pageNum,
      // completed: true,
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.brokentask,
      data: {
        type: '2',
        "current": 1,
        "size": 10,
        status: obj.status,
      },
      method: 'post',
      success: (res) => {
        let data = res.data, dataObj = data.data
        if (data.state === 1) {
          let dataList = this.data.listArr,
            data = res.data,
            resList = data.data.list
          
          resList.map( (item,i) => {
            dataList.push(item)
          })
          this.setData({
            pageNum: this.data.pageNum + 1,
            total: data.data.total,
            listArr: dataList,
          })
          if (this.data.listArr.length == 0) {
            this.setData({
              noData: true
            })
          } else {
            this.setData({
              noData: false
            })
          }
        } else {
          wx.showToast({ title: data.message, icon: 'none', duration: 2000 });
        }
        // console.log('resresresres', res)
      },
    })
  },
  //开始售后 -- 扫码
  bindStartScanCode(e){
    // brokenGoodsNo: '',
      // changeGoodsNo: '',
    let status = e.currentTarget.dataset.status,
      goodsNo = e.currentTarget.dataset.goodsno,
      id = e.currentTarget.dataset.id,
      brokenGoodsNo = e.currentTarget.dataset.brokengoodsno,
      changeGoodsNo = e.currentTarget.dataset.changegoodsno,
      index = e.currentTarget.dataset.index
    this.setData({
      id, brokenGoodsNo, changeGoodsNo
    })
    let goodsItem = this.data.listArr[index]
    wx.setStorage({
      key: 'goodsItem',
      data: goodsItem,
      success: () => {
        this.bindStartSale(goodsNo)
      }
    })
    // this.bindStartSale(goodsNo)
    // this.bindStartSale('ee13c7b79758b05e57f21764b2eb93cd', status, goodsNo)
    // // //GJAQ00000132
    return
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log('wx.scanCode=>result:', res)
        let result = res.result
        this.bindStartSale(result, status, goodsNo)
      },
      fail: (res) => {
        // console.log('fail', res)
      }
    })
  },
  //开始售后 -- 数据对接
  bindStartSale(goodsNo){
    wx.navigateTo({
      url: '/pages/employee/loss/after_sale/details/scan/details/index?goodsNo=' + goodsNo + '&brokenGoodsNo=' + this.data.brokenGoodsNo + '&changeGoodsNo=' + this.data.changeGoodsNo + '&id=' + this.data.id,
    })
    return
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
        id: this.data.id,
      },
      method: 'post',
      success: (res) => {
        let data = res.data, dataObj = data.data[0]
        if (data.state === 1) {
          console.log('dataObj', dataObj)
          wx.setStorage({
            key: 'goodview',
            data: dataObj,
            success: () => {
              wx.navigateTo({
                url: '/pages/employee/loss/after_sale/details/scan/details/index?goodsNo=' + dataObj.goodsNo + '&brokenGoodsNo=' + this.data.brokenGoodsNo + '&changeGoodsNo=' + this.data.changeGoodsNo + '&id=' + this.data.id,
              })
              // brokenGoodsNo: '',
      // changeGoodsNo: '',
              //开始售后
              // if (status === '1' && dataObj.goodsNo == goodsNo){
              //   wx.navigateTo({
              //     url: '/pages/employee/loss/after_sale/details/scan/details/index?brokenGoodsNo=' + dataObj.goodsNo + '&status=' + status + '&id=' + this.data.id,
              //   })
              // }
              // if (status === '1' && dataObj.goodsNo != goodsNo) {
              //   wx.navigateTo({
              //     url: '/pages/employee/loss/after_sale/details/scan/details/index?brokenGoodsNo=' + dataObj.goodsNo + '&status=0' + '&id=' + this.data.id,
              //   })
              // }
              // //正在售后
              // if (status === '0') {
              //   wx.navigateTo({
              //     url: '/pages/employee/loss/after_sale/details/scan/details/index?brokenGoodsNo=' + dataObj.goodsNo + '&status=' + status + '&id=' + this.data.id,
              //   })
              // }
              // if (status === '0' && dataObj.goodsNo != goodsNo) {
              //   wx.navigateTo({
              //     url: '/pages/employee/loss/after_sale/details/scan/details/index?brokenGoodsNo=' + dataObj.goodsNo + '&status=' + status + '&id=' + this.data.id,
              //   })
              // }
            }
          })
        } else {
          wx.showToast({ title: data.message, icon: 'none', duration: 2000 });
        }
        console.log('resresresres', res)
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
    this.getBrokenTask({
      loadMore: true,
      status: this.data.status
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})