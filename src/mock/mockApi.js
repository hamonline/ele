/*
* 利用mockjs来提供模拟数据
*   mockjs 用来拦截ajax请求, 生成随机数据返回
* */
//src下的文件都是打包运行的  所以这里用ES6模块规范引入
import Mock from 'mockjs'
import datas from './data.json'

Mock.mock('/api2/seller',{
  code:0,
  data:datas.seller
})
Mock.mock('/api2/goods',{
  code:0,
  data:datas.goods
})
Mock.mock('/api2/ratings',{
  code:0,
  data:datas.ratings
})



//启用路由 不需要暴露 只需在运行主js文件中引入即可
//export