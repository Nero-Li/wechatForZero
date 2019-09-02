// pages/boss/operation/inventory/index.js
import * as echarts from '../../../../lib/ec-canvas/echarts.js';
import util from '../../../../utils/util.js'
import urlList from '../../../../api/api.js'
let userData = wx.getStorageSync('accountLogin')
let app = getApp()
var charts = [],colorList = [
  '#d97a80', '#2ec8ca', '#ffb880', '#b6a2df', '#27727B',
  '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
  '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
]
let windowWidth = app.getSystemInfo().windowWidth - 30

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addLoss: false,
    addLossArr:[{
      src:'../../../../images/icon_scao.png',
      name:'扫一扫',
    },
    {
      src: '../../../../images/icon_chooseloss.png',
      name:'编码查询',
    }],
    colorList: colorList,
    chartItemWidth: '360',
    xiezaiDate: {
      lazyLoad: true // 延迟加载
    },
    optionObj:
      {
        id:[],
        tooltip: {
          show: false,
          trigger: 'item',
        },
        xAxis: {
          data: [], //"红鸡蛋", "白鸡蛋", "黄鸡蛋", "土鸡蛋"
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
              fontSize: 12,
              color: function (val, index) {
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
            padding: [0, 0, 0, 40]
          },
          max: function (value) {
            return value.max + 200;
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
          top: '38rpx',
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
                return colorList[params.dataIndex]
              },
              label: {
                show: true,
                position: 'top',
                formatter: '{c}' + '箱'
              }
            }
          },
          data: [] //700, 450, 1000, 200
        }]
      },
  },
  //显示下拉扫一扫、查询
  bindAddLoss(){
    let addLoss = this.data.addLoss
    this.setData({
      addLoss: !addLoss
    })
  },
  //获取添加下拉值改变
  bindLossChange(e){
    console.log(e)
    let value = e.currentTarget.dataset.value
    if (value == '0'){
      //报损扫一扫
      wx.scanCode({
        success: (res) => {
          
        }
      })
    }else{
      //报损查询
      wx.navigateTo({
        url: './code_query/index',
      })
    }
    this.setData({
      addLoss: false
    })
  },
  //新增报损
  addLossData(){

  },
  //初始化图表
  init_echarts(optionObj) {
    let self = this;
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      const Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      Chart.setOption(optionObj);
      charts = [Chart]
      // 返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  setOption(Chart, optionObj) {
    Chart.clear();  // 清除
    Chart.setOption(optionObj);  //获取新数据
  },
  //跳转报损管理
  bindToLossManagement(){
    wx.navigateTo({
      url: './loss_management/index',
    })
  },
  //跳转库存列表页
  navigateToList(name,id){
    wx.navigateTo({
      url: './list/index?name=' + name + '&categoryId=' + id,
    })
  },
  //绑定库存类列表
  bindToList(e){
    let name = e.currentTarget.dataset.name, categoryId = e.currentTarget.dataset.id
    this.navigateToList(name, categoryId)
  },
  //获取库存品种数据
  getStatisticsData(obj){
    util.ajax({
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.inventoryStatistics + '?shopId=' + userData.user.shopId + '&companyId=' + userData.user.companyId,
      data: {},
      method: 'post',
      success: (res) => {
        let data = res.data, list = data.data,
          xData = [], yData = [], categoryIds = []
        if (list.length > 0) {
          let listWidth = 40 * list.length + 100
          if (windowWidth <= listWidth){
            this.setData({
              chartItemWidth: listWidth,
            })
          }else{
            this.setData({
              chartItemWidth: windowWidth,
            })
          }
          
          this.init_echarts({});
          
          for (let key in list) {
            categoryIds.push(list[key].categoryId)
            xData.push(list[key].categoryName)
            yData.push(list[key].quantitys)
          }
          
          this.setData({
            'optionObj.id': categoryIds,
            'optionObj.xAxis.data': xData,
            'optionObj.series[0].data': yData,
          })
          setTimeout( ()=> {
            obj.fn(res)
          },500)
          
        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '库存管理'  //修改title
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
    this.echartsComponnet = this.selectComponent('.inventoryDomBar');
    this.getStatisticsData({
      fn: (res) => {
        this.setOption(charts[0], this.data.optionObj);
        charts[0].on('click', (params) => {
          //为柱子设置点击事件
          let name = params.name,
            index = params.dataIndex,
            categoryId = this.data.optionObj.id[index]
          this.navigateToList(name, categoryId)
        });
      
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