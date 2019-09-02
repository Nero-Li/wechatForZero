// pages/component/tabnav/index.js
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
    navItemData: {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navType(){
      var app = getApp();
      let self = this;
      this.setData({
        navItemData: app.globalData.employee
      })
    },

  }
})
