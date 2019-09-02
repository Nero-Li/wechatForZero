//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    status: "",
    sousuo: "",
    connectedDeviceId: "", //已连接设备uuid
    services: "", // 连接设备的服务
    characteristics: "",   // 连接设备的状态值
    writeServicweId: "", // 可写服务uuid
    writeCharacteristicsId: "",//可写特征值uuid
    readServicweId: "", // 可读服务uuid
    readCharacteristicsId: "",//可读特征值uuid
    notifyServicweId: "", //通知服务UUid
    notifyCharacteristicsId: "", //通知特征值UUID
    inputValue: "",
    characteristics1: "", //连接设备的状态值
    weightScale:"",
    lastWeightTime:"",
    cmdString:""
  },
  onLoad: function () {
    if (wx.openBluetoothAdapter) {
      wx.openBluetoothAdapter()
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

  },
  // 初始化蓝牙适配器
  lanya1: function () {
    var that = this;
    wx.openBluetoothAdapter({
      success: function (res) {
        that.setData({
          msg: "初始化蓝牙适配器成功！" + JSON.stringify(res),
        })
        //监听蓝牙适配器状态
        wx.onBluetoothAdapterStateChange(function (res) {
          that.setData({
            sousuo: res.discovering ? "在搜索。" : "未搜索。",
            status: res.available ? "可用。" : "不可用。",
          })
        })
      }
    })
  },
  //搜索设备
  lanya3: function () {
    var that = this;
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
        that.setData({
          msg: "搜索设备" + JSON.stringify(res),
        })
        //连接设备
        wx.createBLEConnection({
          deviceId: "A8:10:87:6A:1C:A1",
          success: function (res) {
            console.log(res.errMsg);
            that.setData({
              connectedDeviceId: "A8:10:87:6A:1C:A1",
              msg: "已连接电子秤",
              msg1: "",
            })
          },
          fail: function () {
            console.log("连接失败");
          },
          complete: function () {
            console.log("连接完成");
            //获取服务
            wx.getBLEDeviceServices({
              // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
              deviceId: that.data.connectedDeviceId,
              success: function (res) {
                that.setData({
                  services: res.services,
                  msg: "连接服务成功",
                })
                //获取特征码
                var strServiceNo = 1;
                wx.getBLEDeviceCharacteristics({
                  // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
                  deviceId: that.data.connectedDeviceId,
                  // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
                  serviceId: that.data.services[strServiceNo].uuid,
                  success: function (res) {
                    for (var i = 0; i < res.characteristics.length; i++) {
                      if (res.characteristics[i].properties.notify) {
                        console.log('可订阅服务', res.characteristics[i].uuid);
                        that.setData({
                          notifyServicweId: that.data.services[strServiceNo].uuid,
                          notifyCharacteristicsId: res.characteristics[i].uuid,
                        })
                      }
                      if (res.characteristics[i].properties.write) {
                        console.log('可写服务', res.characteristics[i].uuid);
                        that.setData({
                          writeServicweId: that.data.services[strServiceNo].uuid,
                          writeCharacteristicsId: res.characteristics[i].uuid,
                        })

                      } else if (res.characteristics[i].properties.read) {
                        console.log('可读取服务', res.characteristics[i].uuid);
                        that.setData({
                          readServicweId: that.data.services[strServiceNo].uuid,
                          readCharacteristicsId: res.characteristics[i].uuid,
                        })

                      }
                    }
                    that.setData({
                      msg1:"已连接服务",
                    })
                  },
                  fail: function () {
                    console.log("失败");
                  },
                  complete: function () {
                    console.log("已完成连接");
                  }
                })
              }
            })
          }

        })
      }
    })
  },
  //断开设备连接
  lanya0: function () {
    var that = this;
    wx.closeBLEConnection({
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        that.setData({
          connectedDeviceId: "",
        })
      }
    })
  },
  //监听input表单
  inputTextchange: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //启用低功耗蓝牙设备特征值变化时的 notify 功能
  lanya9: function () {
    var that = this;
    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      deviceId: "A8:10:87:6A:1C:A1",
      serviceId: "0000ffe0-0000-1000-8000-00805f9b34fb",
      characteristicId: "0000ffe1-0000-1000-8000-00805f9b34fb",
      success: function (res) {
        that.setData({ 
          msg: "Listen服务成功", 
        })
        
      },
      fail: function () {
        console.log('失败');
        console.log(that.data.notifyServicweId);
        console.log(that.data.notifyCharacteristicsId);
      },
    })
  },
  //接收消息
  lanya10: function () {
    var that = this;
    // 必须在这里的回调才能获取
    wx.onBLECharacteristicValueChange(function (characteristic) {
      
      var buffer = characteristic.value;
      var dataview = new DataView(buffer);
      let unit8Arr = new Uint8Array(buffer);
      var str = '';
      for (var i = 0; i < unit8Arr.length; i++) {
        str += String.fromCharCode(dataview.getUint8(i));
      }
      that.setData({
          jieshou: str,
      })
    })
  }
});


function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer), function (bit) {
      return ('00' + bit.toString(16)).slice(-2);
    }
  )
  return hexArr.join('')
}




function buildCmd(e,t)
{
  for (var i = arguments.length, n = Array(i > 2 ? i - 2 : 0), a = 2; a < i; a++) n[a - 2] = arguments[a];
  var r = [e, n.length + 4, t],
    c = 0;
  r.push.apply(r, n), r.forEach(function (e) {
    return c += e
  }), c &= 255, r.push(c);
  var s = "写入数据: " + arrayToHexString(r);
  console.log(s);
  return r;
}

function arrayToHexString(e)
{
  var t = "";
  return e.forEach(function (e) {
    var i = e.toString(16);
    i.length > 1 ? t += i : t += "0" + i
  }), t
}


function writeData(writre)
{
  var that = this;
  var t = new ArrayBuffer(writre.length);
  var i = new DataView(t);
  writre.forEach(function (writre, t) {
      i.setUint8(t, writre)
  });
  wx.writeBLECharacteristicValue({
    deviceId: "04:AC:44:04:7A:3E",
    serviceId: "0000FFF0-0000-1000-8000-00805F9B34FB",
    characteristicId: "0000FFF2-0000-1000-8000-00805F9B34FB",
    value: t,
    success: function(res) {
      wx.onBLECharacteristicValueChange(function (characteristic) {
          var e = new Uint8Array(characteristic.value);
          var i = e[2];
          var n = arrayToHexString(e);
          console.log(n);
          switch (e[0]) {
            case 18:
              var a = buildCmd(19, i, 1, 16, 0, 0, 0); 
              writeData(a);
              break;
            case 16:
              var r = decodeWeight(e[3], e[4]);
              console.log(r);
              if (0 === e[5]) {
                 that.data.jieshou=r;
              }
              break;
            case 20:
              for (var S = getTimeUnix() - 946656e3, g = [], y = 0; y < 4; y++) 
                g.push(S >> 8 * y);
              writeData(buildCmd(32, i, g[0], g[1], g[2], g[3]))
          }
        })
    },
  })
}


function decodeWeight(e,t)
{
  for (var i = ((e << 8) + t) / 100; i > 250;) i /= 10;
  return i 
}

function  getTimeUnix()
{
  var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
    
  return timestamp;
}