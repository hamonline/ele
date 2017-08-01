import Vue from 'vue'

//  引入请求数据的接口 axios或者VueResource 不同于axios，要全局声明引入
import VueResource from 'vue-resource'
// 引入第三方库 moment格式化日期
import moment from 'moment'

import router from './router'
import app from './app.vue'

//引入mockjs服务路由js文件
// import './mock/mockApi'
import './mock/mockServer'

import "./common/styuls/index.styl"

// 自定义全局的过滤器(格式化日期)
Vue.filter('date', function(data) { //data 是被处理的时间值 date是过滤器名
    // 1992-02-08 09:08:08
    return moment(data).format('YYYY-MM-DD HH:mm:ss')
})


Vue.use(VueResource)

new Vue({
    el: '#app',
    render: h => h(app),
    router
})