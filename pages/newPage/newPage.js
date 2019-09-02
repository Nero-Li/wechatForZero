// pages/newPage/newPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOpenBluetooth: false,
    apiBluetoothList: [{
      deviceId: "3C:A5:08:0A:D4:F5",
      name: '李杨的秤'
    }],
    nearBluetoothList: [],
    advertisServiceUUID: '',
    deviceId: '',
    characteristicsId: '',
    weight: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setEnableDebug({
      enableDebug: true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onready')
    this.openBluetooth()
  },
  openBluetooth() {
    let that = this
    wx.openBluetoothAdapter({
      success(res) {
        that.isOpenBluetooth = true
        wx.showToast({
          title: '蓝牙已打开',
        })
        that.startBluetoothDevicesDiscovery()
      },
      fail(res) {
        wx.showToast({
          title: '蓝牙未打开,请先打开蓝牙设备',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  // 搜索附近的蓝牙设备
  startBluetoothDevicesDiscovery() {
    // 假如未打开蓝牙称
    if (!this.isOpenBluetooth) {
      this.openBluetooth()
      return
    }
    let that = this
    wx.startBluetoothDevicesDiscovery({
      success(res) {
        wx.showLoading({
          title: '查找附近的蓝牙设备',
        })
        // res为蓝牙设备返回的信息
        setTimeout(() => {
          wx.hideLoading()
          that.getBluetoothDevices()
        }, 2000)

      },
      fail(res) {
        console.log("连接电子秤失败！");
      }
    })
  },
  // 展开搜索到的蓝牙设备
  getBluetoothDevices() {
    let that = this
    wx.getBluetoothDevices({
      success(res) {
        let tmpArr = []
        res.devices.forEach(item => {
          if (item.advertisServiceUUIDs.length > 0) {
            tmpArr.push(item)
          }
        })
        that.setData({
          nearBluetoothList: tmpArr
        })
        console.log('蓝牙设备列表', res.devices)
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 连接设备
  conect(event) {
    let that = this
    let item = event.currentTarget.dataset.item
    that.setData({
      deviceId: item.deviceId
    })
    wx.showLoading({
      title: '正在连接设备',
    })
    wx.createBLEConnection({
      deviceId: item.deviceId,
      timeout: 3000,
      success(res) {
        // 搜索成功之后关闭搜索功能
        wx.stopBluetoothDevicesDiscovery()
        that.getBLEDeviceServices(item)
      },
      fail(res) {
        wx.showToast({
          title: '连接蓝牙设备失败',
        })
      }
    })
  },
  // 获取设备所有服务
  getBLEDeviceServices(item) {
    let that = this
    wx.getBLEDeviceServices({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId: item.deviceId,
      success(res) {
        console.log('设备', res)
        res.services.forEach((item, index) => {
          that.getBLEDeviceCharacteristics(item)
        })
      }
    })
  },
  // 获取蓝牙设备某个服务中所有特征值(characteristic)。
  getBLEDeviceCharacteristics(item) {
    let that = this
    wx.getBLEDeviceCharacteristics({
      deviceId: that.data.deviceId,
      serviceId: item.uuid,
      success(res) {
        //console.log('特征',res)
        //items.properties.read === true && 
        res.characteristics.forEach((items, index) => {
          if (items.properties.notify === true) {
            that.notifyBLECharacteristicValueChange(item.uuid, items.uuid)
          }
        })
      },
      fail(res) {
        wx.showToast({
          title: '获取特征值失败',
        })
      }
    })
  },
  // 启用低功耗蓝牙设备特征值变化时的 notify 功能
  notifyBLECharacteristicValueChange(uuid1, uuid2) {
    let that = this
    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId: that.data.deviceId,
      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
      serviceId: uuid1,
      // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
      characteristicId: uuid2,
      success(res) {
        wx.hideLoading()
        that.showModal()
      },
      fail(res) {
        wx.showToast({
          title: '服务监听失败',
          icon: 'none'
        })
      }
    })
  },
  // 连接成功提示
  showModal() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '已成功配对，是否开始扫码卸货？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateTo({
            url: '../scanQrCode/scanQrCode'
          })
          // that.onBLECharacteristicValueChange()
        } else if (res.cancel) {
          console.log('用户点击取消')
          that.closeBLEConnection()
        }
      }
    })
  },
  // 断开连接
  closeBLEConnection() {
    let that = this
    wx.closeBLEConnection({
      deviceId: that.data.deviceId,
      success(res) {
        wx.showToast({
          title: '已断开连接',
          icon: 'none'
        })
      }
    })
  },
  //退出登录
  bindLogout() {
    wx.showModal({
      title: '',
      content: '是否退出登录',
      confirmText: '退出',
      confirmColor: '#67c239',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorage({
            key: 'accountLogin',
            success: function (res) {
              wx.removeStorage({
                key: 'wxSessionkey',
                success: function (res) {
                  wx.reLaunch({
                    url: '/pages/login/account/index',
                  })
                }
              })
            }
          })
        }
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