// pages/boss/index/index.js
import * as echarts from '../../../lib/ec-canvas/echarts.js';
import util from '../../../utils/util.js'
import urlList from '../../../api/api.js'
var app = getApp();
let windowWidth = app.getSystemInfo().windowWidth - 30
let userData = wx.getStorageSync('accountLogin')
var charts = [],chartsTitle,timer = util.formatTime(new Date(), 'hour');
if (timer < 4) {
  chartsTitle = '昨日'
} else {
  chartsTitle = '今日'
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    unloadingChartWidth:'360',
    shipmentChartWidth: '360',
    chartsTitle,
    dateStart: util.formatTime(new Date(), 'date'),
    dateEnd: util.formatTime(new Date(), 'date'),
    cutOffTime: util.formatTime(new Date(), 'date'),//截止时间
    xiezaiDate: {
        lazyLoad: true // 延迟加载
    },
    chuhuoDate: {
      lazyLoad: true // 延迟加载
    },
    optionArr:[
      {
        title: {
          // text: chartsTitle + '卸货总数',
          left: 'center',
          padding: 0,
          textStyle:{
            color: '#333',
            fontSize:14
          },
        },
        tooltip: {
          show: false,
          trigger: 'item',
        },
        xAxis: {
          data: [],
          //X轴字体
          axisLabel: {
            formatter: function (value) {
              let valueTxt = '';
              if (value.length > 3) {
                valueTxt = value.substring(0, 4) + '...';
              }
              else {
                valueTxt = value;
              }
              return valueTxt;
            },
            textStyle: {
              color: function (val, index) {
                var colorList = [
                  '#d97a80', '#2ec8ca', '#ffb880', '#b6a2df', '#27727B',
                  '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                  '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                ];
                return colorList[index]
              },
            }
          },
          //X轴
          axisLine: {
            lineStyle: {
              color: '#409eff',
              width: 2,
            }
          }
        },
        yAxis: {
          name: '单位/箱',
          nameTextStyle: {
            fontSize: 14,
            padding: [0,0,0,60]
          },
          max: function (value) {
            return value.max + 100
          },
          axisLine: {
            lineStyle: {
              color: '#409eff',
              width: 2,
            }
          }
        },
        grid: {
          show: true,
          top: '30rpx',
          bottom:'5%',
          left: '0%',
          right:'0%',
          containLabel: true,
        },
        series: [{
          type: 'bar',
          barWidth: 30,
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = [
                  '#d97a80', '#2ec8ca', '#ffb880', '#b6a2df', '#27727B',
                  '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                  '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                ];
                return colorList[params.dataIndex]
              },
              label: {
                show: true,
                position: 'top',
                formatter: '{c}' + '箱'
              }
            }
          },
          data: []
        }]
      },
      {
        title: {
          // text: chartsTitle + '出货总数',
          left: 'center',
          padding: 10,
          textStyle: {
            color: '#333',
            fontSize: 14
          }
        },
        tooltip: {
          show: false,
        },
        xAxis: {
          data: [],//"红鸡蛋", "白鸡蛋", "黄鸡蛋", "咸鸡蛋"
          //X轴字体
          axisLabel: {
            formatter: function (value) {
              let valueTxt = '';
              if (value.length > 3) {
                valueTxt = value.substring(0, 4) + '...';
              }
              else {
                valueTxt = value;
              }
              return valueTxt;
            },
            textStyle: {
              color: function (val,index) {
                var colorList = [
                  '#d97a80', '#2ec8ca', '#ffb880', '#b6a2df', '#27727B',
                  '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                  '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                ];
                return colorList[index]
              },
            }
          },
          //X轴
          axisLine: {
            lineStyle: {
              color: '#409eff',
              width: 2,
            },
          }
        },
        yAxis: {
          name: '单位/箱',
          nameTextStyle: {
            fontSize: 14,
            padding: [0, 0, 0, 60]
          },
          max: function (value) {
            return value.max + 100
          },
          axisLine: {
            lineStyle: {
              color: '#409eff',
              width: 2,
            }
          }
        },
        grid: {
          show: true,
          top: '30rpx',
          bottom: '5%',
          left: '0%',
          right: '0%',
          containLabel: true,
        },
        series: [{
          type: 'bar',
          barWidth: 30,
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = [
                  '#d97a80', '#2ec8ca', '#ffb880', '#b6a2df', '#27727B',
                  '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                  '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                ];
                return colorList[params.dataIndex]
              },
              label: {
                show: true,
                position: 'top',
                formatter: '{c}'+'箱'
              }
            }
          },
          data: [] //200, 150, 200, 100
        }]
      }
    ],
    bill: {
      pageNum: 1,
      total: 0,
      // 状态 0：未结清，1：未回款
      list: [
        // {
        //   storeName: '牛牛蛋糕店',//店名
        //   merchant: '供应商',//商家名
        //   number: '500',//数量
        //   unit: '箱',//单位
        //   state: 0,//状态
        //   money: '-10300',//总额
        //   date: '03月31日 12:59' //时间
        // },
      ]
    }

  },

  // 开始时间
  bindDateStartChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dateStart: e.detail.value
    })
  },
  // 结束时间
  bindDateEndChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dateEnd: e.detail.value
    })
    // 卸货图表
    this.getUnloadChart({
      fn: () => {
        this.setOption(charts[0], this.data.optionArr[0]);
      }
    })
    // 出货图表
    this.getShipmentChart({
      fn: () => {
        this.setOption(charts[1], this.data.optionArr[1]);
      }
    })
    //未结束的账单
    // this.getNotFinishedBill({})
  },
  setTitle(){
    if (timer < 4) {
      wx.setNavigationBarTitle({
        title: '昨日数据'  //修改title
      })
    } else {
      wx.setNavigationBarTitle({
        title: '今日数据'  //修改title
      })
    }
  },
  //初始化图表
  init_echarts(optionObj) {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      const Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      Chart.setOption(optionObj);
      if (charts.length != 2){

      }
      charts.push(Chart)
      // 返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  setOption(Chart, optionObj) {
    Chart.clear();  // 清除
    Chart.setOption(optionObj);  //获取新数据
  },
  //获取今日卸货图表数据
  getUnloadChart(obj) {
    
    util.ajax({
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.unloadGoodsToday,
      data: {
        // shopId: '1',
        "companyId": userData.user.companyId,
        // "goodsCategoryId": "string",
        // "goodsNo": "string",
        // "id": userData.user.id,
        // "marker": "string",
        // "mode": "string",
        // "programId": "string",
        // "remark": "string",
        "shopId": userData.user.shopId,
        // shopId:'1',
        // "supplierId": "string",
        // "taskId": "string",
        "unloadTime": util.formatTime(new Date(), 'date'),
        // "warn": true,
        // "weight": 0
      },
      method: 'post',
      success: (res) => {
        this.echartsComponnet = this.selectComponent('#unloadingDomBar');
        let data = res.data, list = data.data.list,
          xData = [], yData = []
        if (list.length >= 0) {
          let listWidth = 40 * list.length + 100
          if (windowWidth <= listWidth) {
            this.setData({
              unloadingChartWidth: listWidth,
            })
          } else {
            this.setData({
              unloadingChartWidth: windowWidth,
            })
            
          }
          
          this.init_echarts({});
          for (let key in list) {
            xData.push(list[key].name)
            yData.push(list[key].sumVal)
          }
          this.setData({
            'optionArr[0].xAxis.data': xData,
            'optionArr[0].series[0].data': yData,
          })
          setTimeout(() => {
            obj.fn()
          }, 500)
        }
        
        
      },
    })
  },
  //获取今日出货图表数据
  getShipmentChart(obj) {
    
    util.ajax({
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.shipmentGoodsToday,
      data: {
        "companyId": userData.user.companyId,
        "shopId": userData.user.shopId,
        // "goodsCategoryId": "string",
        // "goodsNo": "string",
        // "id": userData.user.id,
        // "marker": "string",
        // "mode": "string",
        // "programId": "string",
        // "remark": "string",
        // "supplierId": "string",
        // "taskId": "string",
        // "unloadTime": '2019-04-28 00:00:00',
        // "warn": true,
        // "weight": 0
      },
      method: 'post',
      success: (res) => {
        this.echartsComponnet = this.selectComponent('#shipmentDomBar');
        let data = res.data, list = data.data,
          xData = [], yData = []
        // console.log(list.length)
        if (list.length >= 0) {
          let listWidth = 40 * list.length + 100
          if (windowWidth <= listWidth) {
            this.setData({
              shipmentChartWidth: listWidth,
            })
          } else {
            this.setData({
              shipmentChartWidth: windowWidth,
            })
          }
          this.init_echarts({});
          for (let key in list) {
            xData.push(list[key].categoryName)
            yData.push(list[key].count)
          }
          this.setData({
            'optionArr[1].xAxis.data': xData,
            'optionArr[1].series[0].data': yData,
          })
          setTimeout(() => {
            obj.fn()
          }, 500)
        }
      },
    })
  },
  //获取未结束账单
  getNotFinishedBill(obj){
    // console.log(this.data.bill.total)
    util.ajax({
      loadMore: obj.loadMore,
      total: this.data.bill.total,
      loadedNum: this.data.bill.list.length,
      pageNum: this.data.bill.pageNum,
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.billList,
      data: {
        // "companyId": userData.user.companyId,
        // "shopId": userData.user.shopId,
        "current": 1,
        "size": 20,
        // "amount": 0,
        // "begintime": this.data.dateStart,
        // "billDate": "2019-05-14T10:01:29.211Z",
        // "billNo": "string",
        // "cussupId": obj.cussupId ? obj.cussupId : null,
        // "endtime": this.data.dateEnd,
        // "keyword": this.data.bill.keyWord,
        // "pages": 0,
        // "quantity": 0,
        "status": 1,
        // "total": 0,
        // "type": this.data.bill.type
      },
      method: 'post',
      success: (res) => {
        let billList = this.data.bill.list, data = res.data, resList = data.data.list
        for (let i = 0, len = resList.length; i < len; i++) {
          let item = resList[i]
          billList.push(item)
        }
        this.setData({
          'bill.pageNum': this.data.bill.pageNum + 1,
          'bill.total': data.data.total,
          'bill.list': billList,
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
  //加载账单更多数据
  refreshListData() {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userData = wx.getStorageSync('accountLogin')
    
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
    charts = []
    this.setData({
      'bill.pageNum': 1,
      'bill.total': 0,
      'bill.list': [],
    })
    this.setTitle()
    userData = wx.getStorageSync('accountLogin')
    // 卸货图表
    this.getUnloadChart({
      fn: () => {
        this.setOption(charts[0], this.data.optionArr[0]);
      }
    })
    // 出货图表
    this.getShipmentChart({
      fn:()=>{
        this.setOption(charts[1], this.data.optionArr[1]);
      }
    })
    //未结束的账单
    this.getNotFinishedBill({})
    // console.log(charts)
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
    // charts = []
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
    this.getNotFinishedBill({
      loadMore: true
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})