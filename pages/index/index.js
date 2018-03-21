//index.js
import { EmptyTool } from '../../utils/util.js';

//获取应用实例
const app = getApp()

var timer; // 计时器

Page({
  data: {
    tempValue: 'Temp：暂未连接',
    waterValue: 'Water：暂未连接',
    lightValue: 'Light：暂未连接',
    shackValue: 'Shack：暂未连接',
    smokeValue: 'Smoke：暂未连接',
    bodyValue: 'Body: 暂未连接',

    tempWarn: '厨房温度过高请注意',
    waterWarn: '',
    lightWarn: '您的保险柜已打开，如非本人操作请注意',
    shackWarn: '您的抽屉正在被暴力拆除',
    smokeWarn: '厨房有着火的可能，已自动打开喷淋装置',
    bodyWarn: '有人闯入',

    tempHidden: true,
    waterHidden: true,
    lightHidden: true,
    shackHidden: true,
    smokeHidden: true,
    bodyHidden: true,
  },

  openMonitor: function (e) {
    console.log('打开监控');
    
    wx.navigateTo({
      url: '../monitor/monitor'
    })
  },

  onLoad: function () {
    fetchAllData(this);
    timerFunc(this);
  },
})

// 倒计时
function timerFunc(that) {
  timer = setTimeout(function () {
    fetchAllData(that);
    timerFunc(that);
  }, 5000);
};

function fetchAllData(that) {
  fetchData(that, 'temp', '厨房温度过高请注意');
  fetchData(that, 'water', null);
  fetchData(that, 'light', '您的保险柜已打开，如非本人操作请注意');
  fetchData(that, 'shack', '您的抽屉正在被暴力拆除');
  fetchData(that, 'smoke', '厨房有着火的可能，已自动打开喷淋装置');
  fetchData(that, 'body', '有人闯入');
}

function fetchData(that, name, msg) {
  wx.request({
    url: 'https://api.bmob.cn/1/classes/' + name, //仅为示例，并非真实的接口地址
    data: {
      order: '-updatedAt',
      limit: '1'
    },
    header: {
      'X-Bmob-Application-Id': '2dea33efb518cf3c263ea4cedbce9e3c',
      'X-Bmob-REST-API-Key': 'db08b20dcf2e130e7b3583c2c604e687'
    },
    success: function (res) {
      console.log(res.data);

      var result = res.data;
      var value;

      if (EmptyTool.isBlank(result)) {
        value = '服务器异常';
      } else {
        var arr = result['results'];
        if (EmptyTool.isBlank(arr)) {
          value = '无最新数据';
        } else {
          var dict = arr[0];
          value = dict[name + '1'];
          if (EmptyTool.isBlank(value)) {
            value = '无最新数据';
          }
        }
      }
      
      if (name == 'temp') {
        that.setData({
          tempValue: 'Temp：' + value,
          tempHidden: (parseInt(value) < 70)
        });
      } else if (name == 'water') {
        that.setData({
          waterValue: 'Water：' + value,
          waterHidden: !(value == 'Gt')
        });
      } else if (name == 'light') {
        that.setData({
          lightValue: 'Light：' + value,
          lightHidden: !(value == 'Gt')
        });
      } else if (name == 'shack') {
        that.setData({
          shackValue: 'Shack：' + value,
          shackHidden: !(value == 'Gt')
        });
      } else if (name == 'smoke') {
        that.setData({
          smokeValue: 'Smoke：' + value,
          smokeHidden: !(value == 'Gt')
        });
      } else if (name == 'body') {
        that.setData({
          bodyValue: 'Body：' + value,
          bodyHidden: !(value == 'Gt')
        });
      }
    }
  })
}