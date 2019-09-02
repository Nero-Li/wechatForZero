// pages/boss/bill/index.js
import util from '../../../utils/util.js'
import urlList from '../../../api/api.js'
let userData = wx.getStorageSync('accountLogin')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenDialogShow: true,
    catchtouchmove: 'catchtouchmove',
    noData: false,
    dateStart: '',
    dateEnd: '',
    cutOffTime: util.formatTime(new Date(), 'date'), //截止时间
    screenItem: {
      customerlist: [{
        name: '合作商',
        check: false,
        id: null
      }, ],
      supplierlist: [{
        name: '供应商',
        check: false,
        id: null
      }, ],
      money: [
        // { name: '支出', check: false, type: 1},
        // { name: '收入', check: false, type: 2},
        {
          name: '已结清',
          check: false,
          status: -1
        },
        {
          name: '未结清',
          check: false,
          status: 1
        },
      ],
      goods: [{
          name: '卸货',
          check: false,
          type: 1
        },
        {
          name: '出货',
          check: false,
          type: 2
        }
      ]
    },
    bill: {
      pageNum: 1,
      total: 0,
      expenditure: '0',
      income: '0',
      keyWord: '',
      type: '', // 类型
      status: '', //状态
      cussupId: '',
      companyId: '', //供应商ID
      /**
       * type 
       * 商品流程 1：卸货货，2：出货
       * 出货 2：合作商，卸货 1：供应商
       */
      // status 1：未结清，-1：已结清，
      list: [
        // {
        //   storeName:'牛牛蛋糕店',//店名
        //   merchant:'供应商',//商家名
        //   goods: ['红鸡蛋','白鸡蛋'],//商品
        //   number:'500',//数量
        //   unit:'箱',//单位
        //   state: 0,//状态
        //   money:'-10300',//总额
        //   goodsFlow: 0, //商品流程
        //   id: '1'
        // },
      ]
    }
  },
  //关键字改变
  bindChangeValue(e) {
    console.log(e)
    let val = e.detail.value
    this.setData({
      'bill.keyWord': val
    })
  },
  //搜索
  bindBillSearch() {
    this.setData({
      'bill.pageNum': 1,
      'bill.list': [],
      'bill.total': 0
    })
    this.getList({})
  },
  // //选择日期
  // bindDateScreenChange(e){
  //   let value = e.detail.value
  //   this.getList({
  //     data: {
  //       billDate: value
  //     }
  //   })
  // },
  // 开始时间
  bindDateStartChange(e) {
    this.setData({
      dateStart: e.detail.value
    })
    let dateE = this.data.dateEnd
    if (dateE != '') {
      this.setData({
        'bill.pageNum': 1,
        'bill.list': [],
        'bill.total': 0
      })
      this.getList({})
    }
  },
  // 结束时间
  bindDateEndChange(e) {
    let dateS = this.data.dateStart
    if (dateS != '') {
      this.setData({
        dateEnd: e.detail.value,
        'bill.pageNum': 1,
        'bill.list': [],
        'bill.total': 0
      })
      this.getList({})
    } else {
      wx.showToast({
        title: '请选择开始时间',
        icon: 'none',
        duration: 2000
      });
    }
  },
  //显示筛选弹窗
  bindShowScreenDialog(e) {
    let dataName = e.currentTarget.dataset.name
    if (dataName == 'confirm') {
      console.log(e)
      this.setData({
        'bill.pageNum': 1,
        'bill.list': [],
        'bill.total': 0
      })
      this.getList({})
    }
    this.setData({
      screenDialogShow: !this.data.screenDialogShow
    })
  },
  // 隐藏筛选弹窗 -- 应用于点击input搜索和日历隐藏筛选弹窗
  bindHideScreenDialog() {
    this.setData({
      screenDialogShow: false
    })
  },
  //筛选弹窗选中
  bindScreenCheck(e) {
    // console.log(e)
    let dataCheck = e.currentTarget.dataset.check,
      splitCheck = dataCheck.split('_'),
      key = splitCheck[0],
      check = !JSON.parse(splitCheck[1]),
      index = splitCheck[2],
      type = splitCheck[3]

    if (key === 'money') {
      let money = this.data.screenItem.money
      money.map((item, i) => {
        this.setData({
          ['screenItem.' + key + '[' + i + '].check']: false
        })
      })
    }
    if (key === 'goods') {
      let goods = this.data.screenItem.goods
      goods.map((item, i) => {
        this.setData({
          ['screenItem.' + key + '[' + i + '].check']: false
        })
      })
    }

    this.setData({
      ['screenItem.' + key + '[' + index + '].check']: check
    })

    if (key === 'money' && check) {
      this.setData({
        'bill.status': type
      })
    }
    if (key === 'money' && check === false) {
      this.setData({
        'bill.status': ''
      })
    }
    if (key === 'goods' && check) {
      this.setData({
        'bill.type': type
      })
    }
    if (key === 'goods' && check === false) {
      this.setData({
        'bill.type': ''
      })
    }

  },
  //禁止页面滚动
  catchtouchmove() {
    return
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
          } else if (res.confirm) {
            //点击确定
          }
        }
      })
    }
  },
  //获取账单列表数据
  getList(obj) {
    util.ajax({
      loadMore: obj.loadMore,
      total: this.data.bill.total,
      loadedNum: this.data.bill.list.length,
      pageNum: this.data.bill.pageNum,
      //loading
      loading: () => {
        wx.showLoading({
          title: '加载中',
          icon: 'loading'
        });
      },
      url: urlList.billList,
      data: {
        "companyId": this.data.bill.companyId,
        // "shopId": userData.user.shopId,
        "current": 1,
        "size": 20,
        // "amount": 0,
        "begintime": this.data.dateStart,
        // "billDate": "2019-05-14T10:01:29.211Z",
        // "billNo": "string",
        "cussupId": this.data.bill.cussupId,
        "endtime": this.data.dateEnd,
        "keyword": this.data.bill.keyWord,
        // "pages": 0,
        // "quantity": 0,
        "status": this.data.bill.status,
        // "total": 0,
        "type": this.data.bill.type
      },
      method: 'post',
      success: (res) => {
        let billList = this.data.bill.list,
          data = res.data,
          resList = data.data.list,
          totalData = res.data.totaldata
        console.log(totalData)
        for (let i = 0, len = resList.length; i < len; i++) {
          let item = resList[i]
          billList.push(item)
        }
        this.setData({
          'bill.pageNum': this.data.bill.pageNum + 1,
          'bill.total': data.data.total,
          'bill.list': billList,
          'bill.expenditure': totalData.outCount,
          'bill.income': totalData.inCount,
        })
        if (this.data.bill.list.length == 0) {
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
  //获取合作商
  getCustomerList(obj) {
    util.ajax({
      loadMore: obj.loadMore,
      total: this.data.bill.total,
      loadedNum: this.data.bill.list.length,
      pageNum: this.data.bill.pageNum,
      //loading
      loading: () => {
        wx.showLoading({
          title: '加载中',
          icon: 'loading'
        });
      },
      url: urlList.billGetCustomerList,
      data: {

      },
      method: 'post',
      success: (res) => {
        let data = res.data,
          list = data.data.list,
          customerList = this.data.screenItem.customerlist
        for (let i = 0, len = list.length; i < len; i++) {
          let item = list[i]
          customerList.push(item)
        }
        this.setData({
          'screenItem.customerlist': customerList
        })
      },
    })
  },
  //获取供应商列表
  getSupplierList(obj) {
    util.ajax({
      loadMore: obj.loadMore,
      total: this.data.bill.total,
      loadedNum: this.data.bill.list.length,
      pageNum: this.data.bill.pageNum,
      //loading
      loading: () => {
        wx.showLoading({
          title: '加载中',
          icon: 'loading'
        });
      },
      url: urlList.billGetSupplierList,
      data: {

      },
      method: 'post',
      success: (res) => {
        let data = res.data,
          list = data.data.list,
          supplierList = this.data.screenItem.supplierlist
        for (let i = 0, len = list.length; i < len; i++) {
          let item = list[i]
          supplierList.push(item)
        }
        this.setData({
          'screenItem.supplierlist': supplierList
        })
      },
    })
  },
  //批量修改账单状态(挂账/销账）
  setBillStateData(id) {
    util.ajax({
      //loading
      loading: () => {
        wx.showLoading({
          title: '加载中',
          icon: 'loading'
        });
      },
      url: urlList.billBatchupdate,
      data: {
        ids: id
      },
      method: 'post',
      success: (res) => {
        console.log(res)
        let data = res.data
        if (data.status == 200) {
          wx.showToast({
            title: '修改状态成功',
            icon: 'none',
            duration: 2000
          });
        }
        if (data.status == 400) {
          wx.showToast({
            title: '账号或密码不正确',
            icon: 'none',
            duration: 2000
          });
        }
      },
    })
  },
  //
  onProgrammeItem(e) {
    // type:0=>合作商；1=>供应商
    let type = e.currentTarget.dataset.selecttype
    if (type === '0') {
      this.setData({
        'bill.cussupId': e.detail.id
      })
      return
    }
    if (type === '1') {
      this.setData({
        'bill.companyId': e.detail.id
      })
      return
    }
  },
  refreshListData(e) {
    // type:0=>合作商；1=>供应商
    let type = e.currentTarget.dataset.selecttype
    if (type === '0') {
      this.getCustomerList({
        loadMore: true
      })
      return
    }
    if (type === '1') {
      this.getSupplierList({
        loadMore: true
      })
      return
    }
  },
  //
  //
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '账单'
    })
    this.getSupplierList({})

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      'bill.pageNum': 1,
      'bill.total': 0,
      'bill.list': [],
      'bill.expenditure': 0,
      'bill.income': 0,
    })
    this.getList({})
    this.getCustomerList({})
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
    this.getList({
      loadMore: true,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})