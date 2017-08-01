<template>
  <transition name="slide">
    <div class="food"  ref="food" v-show="isShow">
    <!-- 需要管理该区域  添加标识  -->
    <div class="food-content">
      <div class="image-header">
        <img :src="food.image"> 
        <div class="back" @click="show(false)">
          <!-- -->
          <i class="icon-arrow_lift"></i>
        </div>
      </div>

      <div class="content">
        <h1 class="title">{{food.name}}</h1> 
        <div class="detail">
          <span class="sell-count">月售{{food.sellCount}}份</span> 
          <span class="rating">好评率{{food.rating}}%</span>
        </div>
        <div class="price">
          <span class="now">￥{{food.price}}</span> 
          <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
        </div> 
        <div class="cartcontrol-wrapper">
          <cartcontrol :food="food" :update-food-count="updateFoodCount"></cartcontrol>
        </div> 
        <div class="buy" v-if="!food.count" @click="updateFoodCount(food,true,$event)">加入购物车</div>
      </div>

      <split></split>

      <div class="info">
        <h1 class="title">商品信息</h1> 
        <p class="text">
         {{food.info}}
        </p>
      </div>

      <split></split>

      <div class="rating">
        <h1 class="title">商品评价</h1> 
        <ratingselect 
          :desc="{all:'全部', positive:'满意', negative:'不满意'}" 
          :ratings="food.ratings"
          :only-content="onlyContent" :selectType="selectType"
          @togglecontent="toggleContent" @setselecttype="setSelectType"
          v-if="food.ratings"></ratingselect>
        <div class="rating-wrapper">
          <ul>
            <li class="rating-item border-1px" v-for="rating in filterRatings">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img width="12" height="12" class="avatar" :src="rating.avatar">
              </div>
              <!--时间过滤器 第三方库 moment 在全局main.js定义一个方法 格式化时间  -->
              <div class="time">{{rating.rateTime | date}}</div> 
              <p class="text">
                <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                {{rating.text}}
              </p>
            </li>
          </ul> 
      <div class="no-rating" 
      v-show="!food.ratings || food.ratings.length===0">暂无评价</div></div></div>
            <!-- v-show="!food.ratings.length">暂无评价</div></div></div> -->
      <!--异步原因 会返回undefined的length  -->

    </div>
   </div>
  </transition>
  
</template>
<script>
  import BScroll from 'better-scroll'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import split from '../split/split.vue'
  import ratingselect from '../ratingselect/ratingselect.vue'  
  

  // 定义常量 （自定义）全选状态码是2  赞是0，踩是1
  const ALL = 2
  export default {
    props:{
      food:Object,
      updateFoodCount:Function
    },
    data () {
      return {
        isShow:false,
        onlyContent:true,
        selectType:ALL
      }
    },
    methods:{
      // 隐藏显示food组件
      show(isShow){
        this.isShow = isShow

        if(this.isShow){// 只有显示时才需要做
        // 异步更新数据 
          this.$nextTick(()=>{
            if(!this.scroll){// 创建对象只创建一个
              this.scroll = new BScroll(this.$refs.food,{
                click:true
              })
            }else{
              // 刷新数据 刷新滚动条
              this.scroll.refresh()
            }
          })

        }
       
      },

      // 切换onlyContent
      toggleContent(){
        this.onlyContent = !this.onlyContent
        // 刷新列表  异步执行
        this.$nextTick(()=>{
          this.scroll.refresh()
        })
      },

      // 更新selectType 评价类型
      setSelectType(selectType){
        this.selectType = selectType

        // 刷新列表 
        this.$nextTick(()=>{
          this.scroll.refresh() // 刷新滚动条
        })
      }
    },

    // 计算属性 评价列表的过滤
    computed :{
      filterRatings(){
        
        // 如果还没有数据, 结束
        if(!this.food.ratings){
          return [] //空数据 不会报错
        }

        const ratings = this.food.ratings
        const {selectType,onlyContent} = this
        // 返回一个数组
        return ratings.filter(rating=>{
          let {rateType,text} = rating
          if(selectType===2){
            // 或运算 第一个为true 不用看第二个  第一个为false，直接返回第二个
            return !onlyContent || !!text
          }else{
            // 与运算 第一个为false 不用看第二个，直接返回第一个
            return selectType===rateType && (!onlyContent || !!text)
          }

        })
      }
    },
    components:{
      cartcontrol,
      split,
      ratingselect
    }
  }  
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/styuls/mixin.styl"

  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: #fff

    &.slide-enter-active, &.slide-leave-active
      transition: transform .3s linear
    &.slide-enter, &.slide-leave-active
      // opacity : 0
      transform: translate3d(100%, 0, 0)

    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20px
          color: #fff

    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .detail
        margin-bottom: 18px
        line-height: 10px
        height: 10px
        font-size: 0
        .sell-count, .rating
          font-size: 10px
          color: rgb(147, 153, 159)
        .sell-count
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
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        font-size: 10px
        color: #fff
        background: rgb(0, 160, 220)
        &.fade-transition
          transition: all 0.2s
          opacity: 1
        &.fade-enter, &.fade-leave
          opacity: 0
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(77, 85, 93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)

        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
</style>

