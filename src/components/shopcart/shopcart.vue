<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toggle">

          <div class="logo-wrapper">
            <div class="logo" :class="{highlight:totalCount>0}">
              <i class="icon-shopping_cart highlight"></i>
            </div>
            <!-- totalCount计算属性 -->
            <div class="num" v-if="totalCount">{{totalCount}}</div>
          </div>
          <!-- totalPrice计算属性 -->
          <div class="price">￥{{totalPrice}}</div>

          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>

        <div class="content-right">
           <!-- <div class="pay" :class="{'not-enough': totalPrice<minPrice, enough: totalPrice>=minPrice}">-->
          <div class="pay" :class="totalPrice<minPrice?'not-enough':'enough'">
            {{payText}}
            <!--计算属性 显示文本  -->
          </div>
        </div>
      </div>
      <!-- js实现动画效果 每个小球都有动画 所以给transition遍历 必须加key -->
      <div class="ball-container">
        <!-- ball小球 两层div控制 ball运动轨迹  外面的控制y加速运行 内部的控制x轴匀速 都是.4s过渡   -->
        <transition @before-enter="beforeDrop"
                    @enter="dropping"
                    @after-enter="afterDrop"
                    v-bind:css="false"
                    v-for="(ball,index) in balls"
                    :key="index">
          <div class="ball"  v-show="ball.isShow">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
      <transition name="fold">
        <!--计算属性listShow 显示购物车列表  -->
        <div class="shopcart-list" v-show="listShow" @click="">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="clear">清空</span>
          </div>
          <div class="list-content" ref='listContent'>
            <ul>
              <li class="food" v-for="(food,index) in foodList" :key='index'>
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" :update-food-count="updateFoodCount"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>

    </div>
    <transition name="fade">
      <div class="list-mask" v-show='listShow' @click="toggle"></div>
    </transition>
  </div>
</template>
<script>
// vue中引入js钩子velocity实现过渡动画
  import Velocity from 'velocity-animate'
  // 
  import BScroll from 'better-scroll'
  import cartcontrol from '../cartcontrol/cartcontrol'
  export default {
    props:{
      foodList: Array,
      minPrice: Number,
      deliveryPrice: Number,
      updateFoodCount: Function
    },
    data(){
      return {
        isShow:false,
        balls:[
          {isShow:false},
          {isShow:false},
          {isShow:false},
          {isShow:false},
          {isShow:false}
        ],
        droppingBalls: [] // 保存多个待执行动画的ball
      }
    },
    computed : {
      totalCount(){
        // let count =0
        // return this.foodList.forEach(food=>{
        //   count += food.count
        // })
        return this.foodList.reduce((preToal, food) => {
          return preToal + food.count
        }, 0)
      },
      totalPrice(){
        // let price = 0
        // return this.foodList.forEach(food=>{
        //   price += food.count*food.price
        // })
        return this.foodList.reduce((preToal, food) => {
          return preToal + food.price*food.count
        }, 0)
      },
      payText(){
        const minPrice = this.minPrice
        const totalPrice = this.totalPrice
        if(totalPrice === 0){
          return `￥${minPrice}元起送`
        }else if (minPrice > totalPrice){
          return `还差￥${minPrice - totalPrice}元起送`
        }else{
          return '去结算'
        }
      },
      listShow(){
        // 如果总数量为0, 直接返回false
        if(!this.totalCount){
          this.isShow = false //防止再次 添加购物车 直接显示列表
          return false
        }
        // 列表实现滚动
        if(this.isShow){
          // 异步数据更新 回调执行
          this.$nextTick(()=>{
            // 如何只创建一个对象?
              // 1. 判断是否已经存在保存的对象, 如果不存在, 进入2
              // 2. 创建对象后, 将对象保存起来===>保存到的对象的变量：1.一直存在2.始终可见
            if(!this.scroll){
              this.scroll=new BScroll(this.$refs.listContent,{
                // 第一次显示列表时创建
                click:true
              })
            }else{
              // 内容的高度超过容器->形成滚动  内容高度小于容器->去掉滚动
              this.scroll.refresh() // 刷新一个滚动条
            }
            
          })
        }
        return this.isShow
      }
    },
    methods:{
      toggle(){
        // 当购物车有food 才显示
        if(this.totalCount){
          this.isShow = !this.isShow
        }
      },
      clear(){
        if(confirm('确定清空购物车吗？')){
          //触发事件  自定义事件 事件名 事件对象
          this.$emit('clearCart',this.foodList)
        }
      },
      // 定义动画函数  启动动画 
      drop(startEl){
        // 找到isShow是false的一个ball对象
         const ball = this.balls.find(ball =>!ball.isShow)
        // 只有找到, 才做动画
        if(ball) {
          // 将ball显示
          ball.isShow = true
          ball.startEl = startEl // 保存对应的起始位置的元素
          this.droppingBalls.push(ball) // 把启动动画的ball保存起来
        }

      },
       beforeDrop(el) {
        console.log('beforeDrop()')
        var offsetX = 0
        var offsetY = 0

        // 取出第一个待启动动画的ball  
        // 这里是用移除 数组中第一个元素，该函数循环执行，其第一个元素是一直改变的
        const ball = this.droppingBalls.shift()
        // 找到点击的startEl
        var startEl = ball.startEl
        // 得到加号起始位置的坐标
        const {left, top} = startEl.getBoundingClientRect()
        // 小球的原始位置的坐标
        const elLeft = 32
        const elBottom = 22
        // 算出偏移量
        offsetX = left-elLeft
        offsetY = -(window.innerHeight-top-elBottom)

        // 瞬间移动动画起始的位置
        el.style.transform = `translate3d(0, ${offsetY}px, 0)`
        el.style.webkitTransform = `translate3d(0, ${offsetY}px, 0)`
        const innerEl = el.children[0]
        innerEl.style.transform = `translate3d(${offsetX}px, 0, 0)`
        innerEl.style.webkitTransform = `translate3d(${offsetX}px, 0, 0)`
       

        // 保存ball
        el.ball = ball
       },
        // 动画开始时: 指定动画结束的位置
      dropping(el,done) {
        console.log('dropping()')
        //强制页面重绘(否则动画瞬间完成, 没有效果)    读取关于位置，尺寸的属性但是不用 (关于性能    )
        // const rf = el.offsetHeight
        // //异步指定
        // this.$nextTick(() => {
        //   el.style.transform = `translate3d(0, 0, 0)`
        //   el.style.webkitTransform = `translate3d(0, 0, 0)`
        //   const innerEl = el.children[0]
        //   innerEl.style.transform = `translate3d(0, 0, 0)`
        //   innerEl.style.webkitTransform = `translate3d(0, 0, 0)`
        // })

        Velocity(el, { transform: 'translate3d(0,0,0)'})
        // 内部div偏移
        Velocity(el.children[0], { transform: 'translate3d(0,0,0)' }, { complete: done })
      },
       // 动画完成之后: 做一些收尾的工作
      // 问题: 在动画生命周期回调函数中更新状态, 页面不变化   2.0没有
      afterDrop(el,done) {
        console.log('afterDrop()')
        // 找到对应的ball
        const ball = el.ball
        ball.startEl = null
        //el不会主动消失, 通过原生dom让el消失
        // el.style.display = 'none'
        // setTimeout(() => {  // 延迟到动画结束时才去隐藏ball
        //   ball.isShow = false
        // }, 400)
        ball.isShow = false
        Velocity(ball, { complete: done })
        // done 是指函数执行完毕
      }
    },
    components:{
      cartcontrol
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/styuls/mixin.styl"
.shopcart
  position: fixed
  left: 0
  bottom: 0
  z-index: 50
  width: 100%
  height: 48px
  .content
    display: flex
    background: #141d27
    font-size: 0
    color: rgba(255, 255, 255, 0.4)
    .content-left
      flex: 1
      .logo-wrapper
        display: inline-block
        vertical-align: top
        position: relative
        top: -10px
        margin: 0 12px
        padding: 6px
        width: 56px
        height: 56px
        box-sizing: border-box
        border-radius: 50%
        background: #141d27
        .logo
          width: 100%
          height: 100%
          border-radius: 50%
          text-align: center
          background: #2b343c
          &.highlight
            background: rgb(0, 160, 220)
          .icon-shopping_cart
            line-height: 44px
            font-size: 24px
            color: #80858a
            &.highlight
              color: #fff
        .num
          position: absolute
          top: 0
          right: 0
          width: 24px
          height: 16px
          line-height: 16px
          text-align: center
          border-radius: 16px
          font-size: 9px
          font-weight: 700
          color: #fff
          background: rgb(240, 20, 20)
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
      .price
        display: inline-block
        vertical-align: top
        margin-top: 12px
        line-height: 24px
        padding-right: 12px
        box-sizing: border-box
        border-right: 1px solid rgba(255, 255, 255, 0.1)
        font-size: 16px
        font-weight: 700
        &.highlight
          color: #fff
      .desc
        display: inline-block
        vertical-align: top
        margin: 12px 0 0 12px
        line-height: 24px
        font-size: 10px
    .content-right
      flex: 0 0 105px
      width: 105px
      .pay
        height: 48px
        line-height: 48px
        text-align: center
        font-size: 12px
        font-weight: 700
        &.not-enough
          background: #2b333b
        &.enough
          background: #00b43c
          color: #fff
  .ball-container
    .ball
      position: fixed
      left: 32px
      bottom: 22px
      z-index: 200
      transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
      .inner
        width: 16px
        height: 16px
        border-radius: 50%
        background: rgb(0, 160, 220)
        transition: all 0.4s linear
  .shopcart-list
    position: absolute
    left: 0
    top: 0
    z-index: -1
    width: 100%
    transform: translate3d(0, -100%, 0)
    &.fold-enter-active, &.fold-leave-active
      transition: all 0.5s
    &.fold-enter, &.fold-leave-active
      transform: translate3d(0, 0, 0)
    .list-header
      height: 40px
      line-height: 40px
      padding: 0 18px
      background: #f3f5f7
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      .title
        float: left
        font-size: 14px
        color: rgb(7, 17, 27)
      .empty
        float: right
        font-size: 12px
        color: rgb(0, 160, 220)

    .list-content
      padding: 0 18px
      max-height: 217px
      overflow: hidden
      background: #fff
      .food
        position: relative
        padding: 12px 0
        box-sizing: border-box
        border-1px(rgba(7, 17, 27, 0.1))
        .name
          line-height: 24px
          font-size: 14px
          color: rgb(7, 17, 27)
        .price
          position: absolute
          right: 90px
          bottom: 12px
          line-height: 24px
          font-size: 14px
          font-weight: 700
          color: rgb(240, 20, 20)
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 6px

.list-mask
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 40
  backdrop-filter: blur(10px)
  opacity: 1
  background: rgba(7, 17, 27, 0.6)
  &.fade-enter-active, &.fade-leave-active
    transition: all 0.5s
  &.fade-enter, &.fade-leave-active
    opacity: 0
    background: rgba(7, 17, 27, 0)
</style>
