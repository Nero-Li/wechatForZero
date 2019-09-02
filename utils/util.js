//时间封装
import urlList from '../api/api.js'
let app = getApp()
const formatTime = (date,type) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  if (type === 'hour'){
    return hour
  }else if (type === 'date') {
    return [year, month, day].map(formatNumber).join('-')
  }else{
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//时间戳转时间格式
const timeStamp = (num,type) => {
  let time = new Date(num)
  return formatTime(time, type)
}

//阿拉伯数字转中文数字
const toChinesNum = (num) => {
  let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  let unit = ["", "十", "百", "千", "万"];
  num = parseInt(num);
  let getWan = (temp) => {
    let strArr = temp.toString().split("").reverse();
    let newNum = "";
    for (var i = 0; i < strArr.length; i++) {
      newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
    }
    return newNum;
  }
  let overWan = Math.floor(num / 10000);
  let noWan = num % 10000;
  if (noWan.toString().length < 4) noWan = "0" + noWan;
  return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
}

const removeStorage = (obj) => {
  return new Promise((resolve, reject) => {
    wx.removeStorage({
      key: obj.key,
      success: function (res) {
        obj.success ? obj.success(res) : resolve(res)
      }
    })
  })
}

// 数据请求封装 -- ajax 【封装说明：该方法有2种回调方式，一种是普通的函数回调，另一种是Promise异步回调。没有params.success参数则走Promise异步回调】
/**
 * RequestTask wx.request(Object object)
  发起 HTTPS 网络请求。使用前请注意阅读相关说明。

  参数
  Object object
  属性	类型	默认值	必填	说明	最低版本
  isLogin 是否为登录 ture/false,默认不传
  url	string		是	开发者服务器接口地址
  data	string/object/ArrayBuffer		否	请求的参数
  header	Object		否	设置请求的 header，header 中不能设置 Referer。content-type 默认为 application/json
  content-type 默认为 application/json
  method	string	GET	否	HTTP 请求方法
  dataType	string	json	否	返回的数据格式
  responseType	string	text	否	响应的数据类型	1.7.0
  success	function		否	接口调用成功的回调函数
  fail	function		否	接口调用失败的回调函数
  complete	function		否	接口调用结束的回调函数（调用成功、失败都会执行）

  模板一（普通函数回调方式）：
  util.ajax({
    loadMore: obj.loadMore,
    total: this.data.supplierList.total,
    loadedNum: this.data.supplierList.list.length,
    pageNum: this.data.supplierList.pageNum,
    //loading
    loading: () => {
      wx.showLoading({ title: '加载中', icon: 'loading' });
    },
    url: urlList.getSupplierList,
    data: {
      "current": 1,
      "size": 20,
    },
    method: 'post',
    success: (res) => {
      let data = res.data
      let dataObj = data.data, list = dataObj.list
      for (let i = 0, len = list.length; i < len; i++) {
        let dataItem = list[i]
        this.data.supplierList.list.push(dataItem)
      }
      this.setData({
        'supplierList.total': dataObj.total,
        'supplierList.pageNum': this.data.supplierList.pageNum + 1,
        'supplierList.list': this.data.supplierList.list
      })
    },
  })

  模板二（Promise回调方式）：
  util.ajax({
    loadMore: obj.loadMore,
    total: this.data.supplierList.total,
    loadedNum: this.data.supplierList.list.length,
    pageNum: this.data.supplierList.pageNum,
    //loading
    loading: () => {
      wx.showLoading({ title: '加载中', icon: 'loading' });
    },
    url: urlList.getSupplierList,
    data: {
      "current": 1,
      "size": 20,
    },
    method: 'post',
  })
  .then( (res) => {
    let data = res.data
    let dataObj = data.data, list = dataObj.list
    for (let i = 0, len = list.length; i < len; i++) {
      let dataItem = list[i]
      this.data.supplierList.list.push(dataItem)
    }
    this.setData({
      'supplierList.total': dataObj.total,
      'supplierList.pageNum': this.data.supplierList.pageNum + 1,
      'supplierList.list': this.data.supplierList.list
    })
  })

 * 
*/

const ajaxFn = (params,success = () => {}) => {
  params.loading()
  //token获取
  let loginStorage = wx.getStorageSync('accountLogin'), loginWxSessionkey = wx.getStorageSync('wxSessionkey'), token = '', wxSessionkey = ''
  if (loginStorage) {
    token = loginStorage.token
  }
  if (loginWxSessionkey) {
    wxSessionkey = loginWxSessionkey
  }

  wx.request({
    url: params.url,
    data: params.data || {},
    header: {
      'content-type': params.header || 'application/json',   // data参数为键值对格式，则设置application/x-www-form-urlencoded
      token: token,
      wxSessionkey
    },
    method: params.method || 'post',
    success(res) {
      // console.log('ressad',res)
      let data = res.data
      if ( data.state == 401 && !params.isLogin) {
        wx.showModal({
          title: '',
          content: '登录过期，请重新登录',
          confirmText: '重新登录',
          confirmColor: '#67c239',
          success: function (res) {
            if (res.confirm) {
              removeStorage({
                key:'accountLogin'
              }).then( (res) => {
                removeStorage({
                  key: 'wxSessionkey'
                })
              }).then((res) => {
                removeStorage({
                  key: 'taskDataList'
                })
              }).then( (res) => {
                wx.reLaunch({
                  url: '/pages/login/index',
                })
              })
            }
          }
        })
      }
      if (data.status == 500 && !params.isLogin){
          wx.showToast({ title: '系统异常', icon: 'none', duration: 2000 });
      }
      wx.hideLoading();
      //是否返回完整数据
      if (params.completed){
        params.success ? params.success(res) : success(res)
      }else{
        if (data.state == 1 || data.state == 0 || data.code) {
          params.success ? params.success(res) : success(res)
        }
        if (data.state == -1) {
          if (params.isLogin) {
            wx.showToast({ title: '微信登录过期，请重新登录', icon: 'none', duration: 2000 });
          } else {
            if (data.msg) {
              wx.showToast({ title: data.msg, icon: 'none', duration: 2000 });
            } else {
              wx.showToast({ title: data.message, icon: 'none', duration: 2000 });
            }

          }

        }
      }
      
    },
    fail() {
      params.hideLoading ? params.hideLoading() : wx.hideLoading();
      wx.showToast({ title: '网络错误', icon: 'none', duration: 2000 });
    },
    complete() {

    }
  })
}
//ajaxFn加于封装Promise和加载更多
const ajax = (params) =>{
  if (!params.loadMore){
    return new Promise( (resolve ,reject) => {
      ajaxFn(params, (res) => {
        resolve(res)
      })
    })
    
  }else{
    //加载更多数据封装 total:总数，loadedNum：条数, pages：总页数，current：分页，size：需要显示条数，data：其它参数,fn:数据返回函数
    return new Promise((resolve, reject) => {
      if (params.total > params.loadedNum) {
        params.data.current = params.pageNum
        params.data.pages = parseInt(params.total / params.data.size)
        ajaxFn(params, (res) => {
          resolve(res)
        })
      }
    })
  }
}

// 文件上传 -- uploadFile
/**
 * UploadTask wx.uploadFile(Object object)
  将本地资源上传到服务器。客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data。使用前请注意阅读相关说明。

  参数
  Object object
  属性	类型	默认值	必填	说明
  url	string		是	开发者服务器地址
  filePath	string		是	要上传文件资源的路径
  name	string		是	文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
  header	Object		否	HTTP 请求 Header，Header 中不能设置 Referer
  formData	Object		否	HTTP 请求中其他额外的 form data
  success	function		否	接口调用成功的回调函数
  fail	function		否	接口调用失败的回调函数
  complete	function		否	接口调用结束的回调函数（调用成功、失败都会执行）
 * */ 
const uploadFile = (params)=> {
  params.loading()
  wx.uploadFile({
    url: params.url,
    filePath: params.filePath,
    name: params.name,
    header: {
      'content-type': params.header || 'application/json'
    },
    formData: params.formData,
    success(res) {
      wx.hideLoading();
      params.success(res)
    },
    fail(){
      wx.hideLoading();
      wx.showToast({ title: '网络错误', icon: 'none', duration: 2000 });
    },
    complete(){
      // params.loaded()
    }
  })
}

//检查是否登录过期
const loginOutTime = (obj) => {
  let loginStorage = wx.getStorageSync('accountLogin'), wxSessionkey = wx.getStorageSync('wxSessionkey')
  if (wxSessionkey) {
    ajax({
      //loading
      loading: () => {
        wx.showLoading({ title: '自动登录中', icon: 'loading' });
      },
      url: urlList.checkwxsession,
      data: {},
      method: 'post',
      isLogin: true,
      success: (res) => {
        let data = res.data
        // // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  app.globalData.userInfo = res.userInfo
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // obj.success(data)
                  if (data.state == 1) {
                    /* 2-Boss端，3-员工端 */
                    wx.switchTab({
                      url: '/pages/boss/index/index',
                    })
                    //店铺老板
                    if (loginStorage.userType == 2) {
                      wx.switchTab({
                        url: '/pages/boss/index/index',
                      })
                    }
                    //店铺员工
                    if (loginStorage.userType == 3) {
                      wx.reLaunch({
                        url: '/pages/employee/index/index',
                      })
                    }
                  }
                  // if (data.state == -1) {
                  //   wx.showToast({ title: '微信登录过期，请重新登录', icon: 'none', duration: 2000 });
                  // }
                }
              })
            }
          }
        })
      },
    })
  }
}

//封装根据店铺id获取用户店铺信息
/**
 * obj.id 店铺id
 * obj.url 员工和老板对应的API地址
 * obj.fn 返回数据函数
 * */ 
const getUserShop = (obj) =>{
  ajax({
    //loading
    loading: () => {
      wx.showLoading({ title: '加载中', icon: 'loading' });
    },
    url: obj.url + '?id=' + obj.id,
    method: 'post',
    success: (res) => {
      console.log(res)
      let data = res.data
      
      if (data.code == 200) {
        obj.fn(data.data)
      }
      if (data.code == 400) {
        wx.showToast({ title: res.msg, icon: 'none', duration: 2000 });
      }
    },
  })
}

//封装根据用户id获取修改用户信息
/**
 * obj.id 用户id
 * obj.url 员工和老板对应的API地址
 * obj.fn 返回数据函数
 * */ 
const updateUserInfo = (obj) =>{
  ajax({
    //loading
    loading: () => {
      wx.showLoading({ title: '加载中', icon: 'loading' });
    },
    url: obj.url,
    data: obj.data,
    method: 'post',
    success: (res) => {
      console.log(res)
      let data = res.data
      obj.fn(data)
      if (data.status == 200) {

      }
      if (data.status == 400) {
        wx.showToast({ title: res.msg, icon: 'none', duration: 2000 });
      }
    },
  })
}

//获取城市
/**
 * "id": "string",
  "levelType": 0,
  "name": "string",
  "parentId": "string"
  * 
  * */
const getCityData = (obj) => {
  ajax({
    //loading
    loading: () => {
      wx.showLoading({ title: '加载中', icon: 'loading' });
    },
    url: obj.url  + '?' + (obj.data ? obj.data : ''),
    method: 'post',
    success: (res) => {
      let data = res.data
      obj.fn(data.data)
      // if (data.code == 200) {
      //   obj.fn(data.data)
      // }
      if (data.code == 400) {
        wx.showToast({ title: res.msg, icon: 'none', duration: 2000 });
      }
    },
  })
}

module.exports = {
  formatTime: formatTime,
  timeStamp,
  toChinesNum,
  ajax,
  uploadFile,
  getUserShop,
  getCityData,
  updateUserInfo,
  loginOutTime,
}
