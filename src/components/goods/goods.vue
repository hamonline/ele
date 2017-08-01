<template>
  <div>
    <div>
      <div class="goods">
        <div class="menu-wrapper" ref="menuWrapper">
          <ul>
            <!-- current 当前所处状态  动态绑定用class对象类型绑定这种已知类名的class -->
            <li class="menu-item" v-for="(good,index) in goods" :class="{current:index===currentIndex}"
                           :key="index" @click="clickMenuItem(index,$event)">
                           <!--clickMenuItem回调第一个参数依据index判断当前点击的具体li对应的ul列表；
                                第二个参数是在pc端有一个原生的click事件，移动端click是better-scroll自封装的
                                     click事件，当在pc端点击时会触发两次click事件
                             -->
              <span class="text border-1px"><!---->
                <span class="icon" :class="supportsClasses[good.type]" v-if="good.type>0"></span>
                {{good.name}}
              </span></li>
          </ul>
        </div>
        <div class="foods-wrapper" ref="foodsWrapper">
          <ul>
            <li class="food-list food-list-hook" v-for="(good,index) in goods" :key="index">
              <h1 class="title">{{good.name}}</h1>
              <ul>
                <li class="food-item border-1px" v-for="food in good.foods" @click="clickFood(food,$event)">
                  <div class="icon">
                    <img width="57" height="57" :src="food.icon">
                  </div>
                  <div class="content">
                    <h2 class="name">{{food.name}}</h2>
                    <p class="desc">{{food.description}}</p>
                    <div class="extra">
                      <span class="count">月售{{food.sellCount}}份</span>
                      <span>好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                      <span class="now">￥{{food.price}}</span>
                      <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                      <cartcontrol :food="food" :update-food-count="updateFoodCount"></cartcontrol>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
          <!--foodList属性通过计算得出 计算方法返回  -->
        <shopcart @clearCart="clearCart"  :food-list="foodList" :min-price="seller.minPrice" 
                  :delivery-price="seller.deliveryPrice" 
                  :update-food-count="updateFoodCount"
                  ref="shopcart"
                  ></shopcart>
      </div>
      <food :food="food" :update-food-count="updateFoodCount" ref="food"></food>
    </div>
  </div>
</template>

<script>  
// 引入better-scroll包
  import BScroll from 'better-scroll'
  // 发送ajax请求
  import axios from 'axios'
  // 引入cartcontrol组件
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  // 引入cartcontrol组件
  import shopcart from '../shopcart/shopcart.vue'
  // 引入food组件 
  import food from '../food/food.vue'

  export default {
    props:{
        // 引入seller 给shopcart 使用内部属性
      seller:Object
    },
    data(){
      return {
        goods:[],
        // 判断显示图标
        supportsClasses:['decrease', 'discount', 'special', 'invoice', 'guarantee'],
        // 监视滚动位置
        tops:[],
        scrollY:0,
        food:{}
      }
    },
    created () {
      // vue-resource发送
      // this.$http.get('/api/goods')
      //   .then(response=>{
      //     const result = response.body
      //     // 更新数据
      //     if(result.code === 0){
      //       this.goods = result.data
      //     }
      //   })
        // axios 发送
      axios.get('/api/goods')
       .then(response=>{
          const result = response.data
          // 更新数据
          if(result.code === 0){
            this.goods = result.data
            // 当异步数据更新 执行滚动
            // this._initScroll()// 确保数据加载完毕
            // setTimeout(()=>{//人为手动延时
            //   this._initScroll()
            // },300)
            // 延迟到界面更新后执行
            this.$nextTick(()=>{
                //初始化滚动
              this._initScroll()
              // /初始化列表项的top值
              this._initTop()
            })
          }
      })
    },
    methods:{
      // 区别与其他回调 命名方式
      _initScroll(){// 创建menu的scroll
        new BScroll(this.$refs.menuWrapper,{
          click:true   // 响应点击事件
        })
        // 通过this 将scroll对象绑定 穿透方法传到其他中
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
          probeType: 3, // 让scroll的_initTop回调函数被调用
          click:true  // 响应点击事件
        })
        // 监视foods的滚动
        this.foodsScroll.on('scroll',(pos)=>{
          // console.log(pos.x + '~' + pos.y)
          this.scrollY = Math.abs(Math.round(pos.y))
          // console.log(this.scrollY)
        })
      },
      _initTop(){
        const lis = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let top = 0
        this.tops.push(top)
        for(let i=0,len=lis.length;i<len;i++){
          let li = lis[i]
          top += li.clientHeight
          this.tops.push(top)
        }
        console.log(this.tops)
      },
      clickMenuItem (index,event) {
        // console.log(event,--this.tops[index])
        if(!event._constructed){
          // 原生的click事件对象中没有_constructed属性
          return
        }
        const lis = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        const li = lis[index]
        // better-scroll 中滚动对象的方法scrollToElement- li是指定对象， 300是滚动时间
        // this.foodsScroll.scrollToElement(li,300)
        this.foodsScroll.scrollToElement(li, 300)

      },
      // 定义food 中count变化的方法  注：food数据本身没有count属性
      updateFoodCount(food,isAdd,event){
        if(!event._constructed){
          return
        }
        console.log(event)
          if(isAdd){
            // count 加1
            if(!food.count){// 第一次读取food

            // 新增的属性没有监视
              // food.count = 1// 给food添加了count属性(没有数据绑定)
              this.$set(food,'count',1) //有数据绑定, 会更新界面
              // console.log('updateFoodCount()',food)
            }else{
              food.count++
            }

            // 启动ball动画
            this.$refs.shopcart.drop(event.target)
          }else{//减
            if(food.count){//当count不为0 且存在
              food.count--
            }
          }      
      },

      // 清空购物车
       clearCart () {
        this.foodList.forEach(food => {
          food.count = 0
        })
      },

      clickFood (food,event) {
        // 显示food详情 
        if (!event._constructed) {
          return
        }
        // 设定food
        this.food = food
        // 显示food
        this.$refs.food.show(true)
      }


    },
    // 计算属性 index 来判断当前分类对象的class类current
    computed :{
      currentIndex () {
        return this.tops.findIndex((top,index)=>{
          // return true //返回的是 第一个
          return this.scrollY >= top && this.scrollY<this.tops[index+1]
        })
      },
      foodList(){ // 找出所有count>0的food
        const foods = []
        this.goods.forEach(good=>{
          good.foods.forEach(food=>{
            if(food.count){
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    // 映射组件
    components : {
      cartcontrol,
      shopcart,
      food
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/styuls/mixin.styl"

.goods
  display: flex
  position: absolute
  top: 174px
  bottom: 46px
  width: 100%
  overflow: hidden
  .menu-wrapper
    flex: 0 0 80px
    width: 80px
    background: #f3f5f7
    .menu-item
      display: table
      height: 54px
      width: 56px
      padding: 0 12px
      line-height: 14px
      &.current
        position: relative
        z-index: 10
        margin-top: -1px
        background: #fff
        font-weight: 700
        .text
          border-none()
      .icon
        display: inline-block
        vertical-align: top
        width: 12px
        height: 12px
        margin-right: 2px
        background-size: 12px 12px
        background-repeat: no-repeat
        &.decrease
          bg-image('decrease_3')
        &.discount
          bg-image('discount_3')
        &.guarantee
          bg-image('guarantee_3')
        &.invoice
          bg-image('invoice_3')
        &.special
          bg-image('special_3')
      .text
        display: table-cell
        width: 56px
        vertical-align: middle
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 12px
  .foods-wrapper
    flex: 1
    .title
      padding-left: 14px
      height: 26px
      line-height: 26px
      border-left: 2px solid #d9dde1
      font-size: 12px
      color: rgb(147, 153, 159)
      background: #f3f5f7
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      border-1px(rgba(7, 17, 27, 0.1))
      &:last-child
        border-none()
        margin-bottom: 0
      .icon
        flex: 0 0 57px
        margin-right: 10px
      .content
        flex: 1
        .name
          margin: 2px 0 8px 0
          height: 14px
          line-height: 14px
          font-size: 14px
          color: rgb(7, 17, 27)
        .desc, .extra
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
        .desc
          line-height: 12px
          margin-bottom: 8px
        .extra
          .count
            margin-right: 12px
        .price
          font-weight: 700
          line-height: 24px
          .now
            margin-right: 8px
            font-size: 14px
            color: rgb(240, 20, 20)
          .old
            text-decoration: line-through
            font-size: 10px
            color: rgb(147, 153, 159)
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 12px
</style>

