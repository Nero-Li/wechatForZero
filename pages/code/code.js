// pages/code/code.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    weight: "",
    deviceId: '',
    isOpenBluetooth: false
  },
  onLoad(){
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })
    
    this.openBluetooth()
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    //监听成功后，接受秤数据 
    onBLECharacteristicValueChange() {
      var weightVal;
      wx.onBLECharacteristicValueChange(function (characteristic){
        var buffer = characteristic.value;
        var dataview = new DataView(buffer);
        let unit8Arr = new Uint8Array(buffer);
        for (var i = 0; i < unit8Arr.length; i++) {
          weightVal += String.fromCharCode(dataview.getUint8(i));
        }
        this.setData({
          weight: weightVal
        })
      })
    },
    toastShow: function (sup, eggtype, reTips, weight) {
      //弹窗方法
      var _this = this;
      _this.setData({
        isShow: true,
        sup: sup,
        eggtype: eggtype,
        reTips: reTips,
        weight: weight,
      });
      setTimeout(function () {    
        _this.setData({
          isShow: false
        });
      }, 2000);
    },
    openBluetooth(){
      wx.openBluetoothAdapter({
        success(res) {
          //打开蓝牙成功
          this.isOpenBluetooth = true
          wx.showToast({
            title: '蓝牙成功打开',
            icon: 'none',
            duration: 3000
          })
          // this.startBluetoothDevicesDiscovery()
        },
        fail(res) {
          wx.showToast({
            title: '蓝牙打开失败',
            icon: 'none',
            duration: 3000
          })
        }
      }); 
    },
    //搜索并连接电子秤
    startBluetoothDevicesDiscovery() {
      // 假如未打开蓝牙称
      if (!this.isOpenBluetooth){
        this.clicktoast()
        return
      }
      wx.startBluetoothDevicesDiscovery({
        success(res) {
          // 搜索成功之后关闭搜索功能
          wx.stopBluetoothDevicesDiscovery()
          // res为蓝牙设备返回的信息
          this.deviceId = res
          alert('蓝牙设备返回的信息', JSON.stringify(res))
          // this.createBLEConnection()
        },
        fail: function () {
          console.log("连接电子秤失败！");
        }
      })
    },
    // 连接低功耗蓝牙设备。
    createBLEConnection() {
      wx.createBLEConnection({
        deviceId: this.deviceId,
        success(res) {
          alert('蓝牙设备返回的信息', JSON.stringify(res))
          //连接成功后获取指定服务
          wx.getBLEDeviceServices({
            deviceId: this.deviceId,
            success(res) {
              console.log(res)
              //获取服务后启用特征码监听
              wx.notifyBLECharacteristicValueChange({
                state: true, // 启用 notify 功能
                deviceId: this.deviceId,
                serviceId: "0000ffe0-0000-1000-8000-00805f9b34fb",
                characteristicId: "0000ffe1-0000-1000-8000-00805f9b34fb",
                success: function (res) {
                  wx.showToast({
                    title: '服务监听成功',
                    icon: 'none',
                    duration: 3000
                  })
                }
              })
            }
          })
        }
      })
    },
    click: function () {
      var that = this;
      var weightVal;
      var datal1;
      var datal2;
      //1.打开扫码，识别二维码，获取称重数据
      wx.scanCode({
        success: (res) => {
          
          let title = res.result
          var datalist = title.split('&');
          datal1 = datalist[0];
          datal2 = datalist[1];
          wx.onBLECharacteristicValueChange(function (characteristic) {
            weightVal="";
            var buffer = characteristic.value;
            var dataview = new DataView(buffer);
            let unit8Arr = new Uint8Array(buffer);
            for (var i = 0; i < unit8Arr.length; i++) {
              weightVal += String.fromCharCode(dataview.getUint8(i));
            }
            that.setData({
              weight: weightVal
            })
          })
          
        },
        fail: (res) => {
          wx.showToast({
            title: '失败',
            icon: 'none',
            duration: 3000
          })
        },
        complete: (res) => {
          this.toastShow(datal1, datal2, "R", that.data.weight);
          setTimeout(() => {
            // this.click();
          }, 3000)
        }
      })
    } 
  }
})
