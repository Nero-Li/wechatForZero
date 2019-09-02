// pages/component/select/index.js
import util from '../../../utils/util.js'
import urlList from '../../../api/api.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    parentArray: {
      type: Array,
    },
    propArray: {
      type: Array,
    },
    selectType: Number,
    parentIndex: Number,
    propIndex:Number,
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectShow: false,//初始option不显示
    selectType2Show: false,//初始option 类型2不显示
    nowText: "",//初始内容
    animationData: {},//右边箭头的动画
    selectIndex:-1,
    type2FristIndex: 0, //select类型2第一个选中
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //option的显示与否
    selectToggle: function () {
      var nowShow = this.data.selectShow;//获取当前option显示的状态
      //创建动画
      var animation = wx.createAnimation({
        timingFunction: "ease"
      })
      this.animation = animation;
      if (nowShow) {
        animation.rotate(90).step();
        this.setData({
          animationData: animation.export()
        })
      } else {
        animation.rotate(-90).step();
        this.setData({
          animationData: animation.export()
        })
      }
      this.setData({
        selectShow: !nowShow
      })
    },
    //设置内容
    setText: function (e) {
      let nowData = this.properties.propArray,//当前option的数据是引入组件的页面传过来的，所以这里获取数据只有通过this.properties
        type = this.properties.selectType, //select类型
        nowIdx = e.currentTarget.dataset.index,//当前点击的索引
        select = e.currentTarget.dataset.select//当前点击的内容
      //再次执行动画，注意这里一定，一定，一定是this.animation来使用动画
      if (type == 1){
        let nowText = nowData[nowIdx].name
        this.animation.rotate(90).step();
        this.setData({
          selectShow: false,
          selectIndex: nowIdx,
          nowText: nowText,
          animationData: this.animation.export()
        })
        // 使用 triggerEvent 方法触发自定义组件事件，指定事件名、detail对象和事件选项
        let endItem = { ...nowData[nowIdx] }
        this.triggerEvent('endSelect', endItem)
      }
      if (type == 2) {
        let parentData = this.properties.parentArray, 
          fristIndex = this.data.type2FristIndex, 
          parentText = parentData[fristIndex].name
        if (select == 1){
          this.setData({
            type2FristIndex: nowIdx,
            selectIndex: -2,
          })
          parentData = this.properties.parentArray
          fristIndex = this.data.type2FristIndex
          parentText = parentData[fristIndex].name
          // 使用 triggerEvent 方法触发自定义组件事件，指定事件名、detail对象和事件选项
          let fristItem = { ...parentData[fristIndex] }
          this.triggerEvent('fristSelect', fristItem)
          if (parentData.length > 0){
            this.setData({
              nowText: parentText + '/' + this.properties.propArray[0].name,
            })
          }
        }else{
          let nowText = nowData[nowIdx].name
          this.animation.rotate(90).step();
          this.setData({
            selectShow: false,
            selectIndex: nowIdx,
            nowText: parentText + '/' + nowText,
            animationData: this.animation.export()
          })
          // 使用 triggerEvent 方法触发自定义组件事件，指定事件名、detail对象和事件选项
          let endItem = { ...nowData[nowIdx] }
          this.triggerEvent('endSelect', endItem)
        }
      }
    },
    //加载更多事件
    bindScrollTolower(e){
      let name = e.currentTarget.dataset.name
      if (name === 'childrenlist'){
        let childrenItem = { ...e.currentTarget.dataset }
        this.triggerEvent('scrollChildrenMore', childrenItem)
      }
      if (name === 'parentlist') {
        let parentItem = { ...e.currentTarget.dataset }
        this.triggerEvent('scrollParentMore', parentItem)
      }
    },
  }
})
