// pages/common/information/store_address/index.js
import util from '../../../../utils/util.js'
import urlList from '../../../../api/api.js'
let userData = wx.getStorageSync('accountLogin')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum:1,
    pageSize:20,
    total:'',
    storeList:[],
    adressValue:'',
  },
  //门店数据处理函数
  storeListData(){
    util.ajax({
      //loading
      loading: () => {
        wx.showLoading({ title: '加载中', icon: 'loading' });
      },
      url: urlList.getShopList + '?pageNum=0' + '&pageSize=' + this.data.pageSize + '&name=' + this.data.adressValue,
      method: 'post',
      success: (res) => {
        console.log('data',res)
        let data = res.data
        this.setData({ 
          storeList: data.data.data,
          total: data.data.total
        })
        if (data.code == 200) {
          // obj.fn(data.data)
         
        }
        if (data.code == 400) {
          wx.showToast({ title: res.msg, icon: 'none', duration: 2000 });
        }
      },
    })
    
  },
  //加载更多
  loadMoreList(){
    util.loadMoreData({
      total:this.data.total,
      url: urlList.getShopList,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      data: '&name=' + this.data.adressValue,
      fn:(res)=>{
        this.setData({
          pageNum: this.data.pageNum + 1,
          storeList: this.data.storeList.push(res.data.data),
          total: res.data.total
        })
        console.log(res)
      }
    })
  },
  //动态改变地址
  bindadressChange(e){
    let value = e.detail.value
    this.setData({
      adressValue: value
    })
  },
  //获取选择地址
  bindgetChooseAdress(e) {
    let address = e.currentTarget.dataset.address,
      id = e.currentTarget.dataset.shopid
    wx.reLaunch({
      url: '../perfect/index?address=' + address + '&shopId=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.storeListData()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})