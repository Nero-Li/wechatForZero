// pages/boss/my/store_management/index.js
let userData = wx.getStorageSync('accountLogin')
import util from '../../../../utils/util.js'
import urlList from '../../../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choosedProvince: '',//选择省
    choosedProvinceId: '',//选择省Id
    choosedCity: '',//选择城市
    choosedCityId: '',//选择城市Id
    provincesArr: [],//省数据
    provinceIdArr: [],//省id数据
    cityArr: [],//城市数据
    cityIdArr: [],//城市id数据
  },
  //获取城市
  getCityData(obj){
    let dataObj = {}
    dataObj.nameList = []
    dataObj.idList = []
    util.getCityData({
      url: urlList.getCitysList,
      data:obj.id,
      fn: (res) => {
        console.log('getCitysList', res)
        for(let list in res){
          dataObj.nameList.push(res[list].name)
          dataObj.idList.push(res[list].id)
        }
        obj.fn(dataObj)
      }
    })
  },
  bindPickerChange(e){
    let pickerType = e.currentTarget.dataset.picker,
      index = e.detail.value
    
    if (pickerType === 'province'){
      this.setData({
        choosedProvince: this.data.provincesArr[index],
        choosedProvinceId: this.data.provinceIdArr[index]
      })
      this.getCityData({
        id: 'id=' + this.data.provinceIdArr[index] + '&levelType=2',
        fn: (obj) => {
          console.log(obj)
          // this.setData({
          //   provincesArr: obj.nameList,
          //   provinceIdArr: obj.idList
          // })
        }
      })
    }
    if (pickerType === 'city') {
      this.setData({
        choosedCity: this.data.cityArr[index],
        choosedCityId: this.data.cityIdArr[index],
      })
    }
  },
  //获取用户门店
  getUShop(){
    util.getUserShop({
      url: urlList.getShop,
      id: userData.user.shopId,
      fn:(res)=>{
        console.log('res',res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCityData({
      id:'',
      fn:(obj) =>{
        console.log(obj)
        this.setData({
          provincesArr: obj.nameList,
          provinceIdArr: obj.idList
        })
      }
    })
    this.getUShop()
    wx.setNavigationBarTitle({
      title: '门店选择',
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})