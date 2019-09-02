# xiaochengxu_Pro

#### 介绍
养鸡一条龙微信小程序管理平台

#### 软件架构

```

├── pai
├── images
├── lib
├── pages
    ├── boss 老板端
        ├── bill 账单
            ├── index.js
            ├── index.json
            ├── index.wxml
            ├── index.wxss
            └── details
                ├── index.js
                ├── index.json
                ├── index.wxml
                └── index.wxss
        ├── index 首页
        ├── my 我的
        └── operation 操作
            ├── index.js
            ├── index.json
            ├── index.wxml
            ├── index.wxss
            ├── disburden 卸货
            ├── inventory 库存
            └── shipment 出货
    ├── common
    ├── component
    ├── employee 员工端
        ├── index 首页用于切换底部导航
        ├── loss 报损
        ├── my 我的
        └── shipment 出货
    ├── login
    └── role_selection
├── utils
├── app.js
├── app.json
└── app.wxss

```