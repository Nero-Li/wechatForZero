// let basePath = 'http://120.78.1.33:8081'
// https://www.wuzero.com 这个对应的是39.98.231.170
let basePath = 'https://www.wuzero.com/api'

// type 1为卸货，type 2为出货
//任务状态：status (string, optional): 状态( 0:执行中 1：已取消 2：已完成 3：已暂停) ,
//type (integer, optional): 身份类型（1-PC端，2-Boss端，3-员工端，4-设备端） ,

//出货 3 为员工已完成,老板才能填
const api = {
  basePath: '',
  'addunloaddetl': '/unload-goods/addunloaddetl', // 新增卸货商品
  liststandardddataanddetl: '/baseinfo/standard/liststandardddataanddetl',
  //基本数据接口
  getCitysList: '/customer/getcitys',// 查询省份列表
  getCompanyShop: '/shop/get-company.data',// 根据企业id查询店铺
  getShop: '/shop/get.data',// 根据Id查询店铺
  getShopList: '/shop/list.data',//分页查询店铺
  getUserInfo: '/user/get.data',// 根据Id查询员工
  getSupplierList: '/suppliermanage/getsupplierlist',// 查询供应商列表 
  getListStandard: '/baseinfo/standard/liststandard',// 根据品种id列出所有方案(下拉列表用)
  getListStandardddataanddetl: '/baseinfo/standard/liststandardddataanddetl',// 根据品种id列出所有方案及其细节
  getListStandarddetel: '/baseinfo/standard/liststandarddetel',// 根据方案id列出其下方案细
  getListEggType: '/baseinfo/variety/listeggtype',// 查询鸡蛋列表(带分页模糊查询)
  /* 登录 */
  loginAccount: '/system/login',//账号登录
  wxLogin: '/wxLogin',//微信授权登录
  checkwxsession: '/checkwxsession',// 微信登录状态监测
  /* 首页 */
  index:'',//首页
  unloadGoodsToday: '/unload-goods/queryunloadgoodsforday', // 根据当天日期、按店铺、品种统计今日卸货数量
  shipmentGoodsToday: '/shipment-goods/today-statistics', // 每日出货品种数目统计
  /* 操作 */
  //卸货
  unloadTaskList: '/task/unloadlist.data',// 查询卸货任务 （卸货出货通用）
  unloadList: '/unload-goods/unloadlist.data',// 分页查询卸货商品
  unloadTaskState: '/task/UnloadTaskState', //卸货任务结束/取消
  changeProgram:'/task/changeprogram.do',// 更换任务方案状态
  queryUnloadGoods: '/unload-goods/queryunloadgoods',// 根据任务id, 按品种、方案分组统计本次卸货数量 --卸货中的整理归类
  unloadAdd: '/task/unloadadd',// 新增卸货任务
  //出货
  shipmentTaskList: '/task/shipment-task-list.data',// 查询出货任务
  shipmentList: '/shipment-goods/shipment-list.data',// 查询出货商品(出货完成用)
  shipmentGoodsList: '/shipment-goods/shipmentgoodslist',// 查询当前出货任务的商品(出货列表用)
  cancelShipment: '/task/cancel-shipment',// 取消出货任务(PC端或者老板移动端取消任务)
  finishShipmentTask: '/task/finishshipmenttask',// 完成出货任务(PC端或者老板移动端完成任务)
  forceFinishShipmentTask: '/task/forcefinishshipmenttask',// 老板强制完成出货任务(PC端或者老板移动端完成任务)
  shipmentGoodsRemove: '/shipment-goods/remove',// 移除出货商品
  //库存
  inventoryStatistics: '/stock/statistics', // 店铺下各品种的库存数量
  inventoryFindcategory:'/stock/findcategory.data',// 库存中存在的品种
  inventoryFindBySpecification: '/stock/findbyspecification.data',// 仓库规格下商品详情
  inventoryList: '/stock/list.data',// 根据条件查询库存
  inventoryListPage: '/stock/list-page.data',// 分页查询库存
  /* 账单 */
  billList: '/bill/getBilllist',//分页查询财务账单POST /bill/getBilllist 查询账单列表
  billDetails: '/billdetails/getbilldetsils', //根据账单主键查询账单详情
  billStateUpdate: '/bill/billstateupdate',// 批量修改账单状态(挂账/ 销账)
  billEditAmount: '/billdetails/editAmount',// 更新账单详情金额
  billGetSupplierList: '/bill/getsupplierlist',// 查询供应商列表（账单）
  billGetCustomerList: '/bill/getcustomerlist',// 查询客户列表（账单)
  queryBlanBillSortList: '/task/queryblanbillsortlist',//查询出货详情 (空账单详情)
  updateBlankBill: '/bill/updateblankbill',//更新空的出货账单信息
  /* 我的 */
  editUserInfo: '/user/edit.do',// 根据id修改员工信息

  /* 员工端 */
  employee:'',
  getCustomerList: '/customer/getcustomerlist',// 查询客户列表
  shipmentStatistics: '/shipment-goods/shipment-statistics.data',// 统计出货商品
  shipmentTaskAdd: '/task/shipmenttaskadd',// 新增出货任务
  shipmentGoodsAdd: '/shipment-goods/add',// 新增出货商品
  emplyeeFinishTask: '/task/emplyeefinishtask',// 员工完成出货任务

  /** 报损*/
  brokenAdd: '/broken/add',// 新增报损 type  自损  传1   报损传2
  brokenstep1: '/broken/brokenstep1',// 扫码要替换的货
  brokenstep2: '/broken/brokenstep2',// 扫码坏掉的货
  brokentask: '/broken/brokentask',// 查询报损列表 status：1开始售后，0正在售后，-1完成售后
  changestutus: '/broken/changestutus',// 修改报损状态
  goodview: '/broken/goodview',// 查询货物信息 type  自损  传1   报损传2
}

for(let key in api){
  api[key] = basePath + api[key]
}

export default{
  ...api
}