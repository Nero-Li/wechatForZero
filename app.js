//app.js
App({
  onLaunch: function () {

  },
  // 获取手机系统信息
  getSystemInfo(){
    let systemInfo = {};
    wx.getSystemInfo({
      success: (res) => {
        systemInfo = res
      }
    })
    return systemInfo
  },
  //获取DOM节点
  /**
   * selectorArr => 数组
   * 
   */
  getQueryNodes(selectorArr,fn = () => { }){
    let query = wx.createSelectorQuery();
    for (let i = 0, len = selectorArr.length; i < len ; i++){
      query.select(selectorArr[i]).boundingClientRect().exec((res) => {
        if (i == (len - 1)){
          fn(res)
        }
      })
    } 
  },
  //页面可滚动高度
  windowScrollHeight(fn = () => { }) {
    let systemInfo = this.getSystemInfo();
    fn(systemInfo.windowHeight)
  },
  globalData: {
    userInfo: null,
    userLoginData:null,
    //员工端导航栏
    employee: {
      "color": "#333",
      "selectedColor": "#f00",
      "backgroundColor": "#f7f7f7",
      "borderStyle": "#ccc",
      "position": "bottom",
      "list": [
        {
          "pagePath": "/pages/employee/loss/index",
          "text": "报损",
          "iconPath": "/images/icon_loss.png",
          "selectedIconPath": "/images/icon_loss_selected.png",
          "clas": "menu-item",
          "selectedColor": "#2a73b1",
          active: true
        },
        {
          "pagePath": "/pages/employee/shipment/index", 
          "text": "出货",
          "iconPath": "/images/icon_shipment.png",
          "selectedIconPath": "/images/icon_shipment_selected.png",
          "selectedColor": "#2a73b1",
          "clas": "menu-item",
          active: false
        },
        {
          "pagePath": "/pages/employee/my/index",
          "text": "我的",
          "iconPath": "/images/icon_my.png",
          "selectedIconPath": "/images/icon_my_selected.png",
          "selectedColor": "#2a73b1",
          "clas": "menu-item",
          active: false
        }
      ],
    },
  }
})