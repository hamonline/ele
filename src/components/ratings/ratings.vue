<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">

      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :score="seller.serviceScore" :size="36"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :score="seller.foodScore" :size="36"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>

      <split></split>

      <ratingselect :desc="desc"
                    :only-content="onlyContent"
                    :ratings="ratings"
                    :select-type="selectType"
                    @togglecontent="toggleContent"
                    @setselecttype="setSelectType"></ratingselect>

      <div class="rating-wrapper">
        <ul>
          <!-- <li class="rating-item" v-for="rating in ratings" v-show="needShow(rating)"> -->
          <li class="rating-item" v-for="rating in filterRatings">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :score="rating.score" :size="24"></star>
                <span class="delivery">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend">
                <span :class="{'icon-thumb_up':rating.rateType===0, 'icon-thumb_down':rating.rateType===1}"></span>
                <span class="item" v-for="item in rating.recommend">{{item}}</span>
              </div>
              <div class="time">
                <!--过滤器  -->
                {{rating.rateTime | date}}
                <!-- // 类似angular用法  {{date | date : 'yyyy-MM-dd hh:mm:ss EEEE'}} -->
              </div>
            </div>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>


<script>
// 路由组件 需要发送ajax请求
// 当路由路径被访问，且发送请求 则该映射的路由组件创建==>即路由组件被需要时才创建
  import axios from 'axios'
  import moment from 'moment'
  import BScroll from 'better-scroll'
  import star from '../star/star.vue'
  import split from '../split/split.vue'
  import ratingselect from '../ratingselect/ratingselect.vue'

// 定义常量 保存评价的类型
  const ALL = 2

  export default {
    props:{
      seller:Object
    },
    data () {
      return {
        ratings:[],
        onlyContent: false,
        selectType:ALL
      }
    },
     created(){
      // 创建静态数据 不需要监视
      this.desc={all: '全部',positive: '满意',negative: '不满意'}

      // ajax获取ratings数据
      axios.get('/api2/ratings')
        .then(response=>{
          const result = response.data

          // 正确数据
          if(result.code===0){
            this.ratings = result.data
            this.$nextTick(()=>{
              if(this.$refs.ratings){
                // 获取数据后 创建scroll对象
                this.scroll = new BScroll(this.$refs.ratings,{
                  click:true
                })
              }
              
            })
           
          }
        })

    },
    methods:{
    //切换 onlyContent
      toggleContent(){
        this.onlyContent = !this.onlyContent
        //刷新列表
        this.$nextTick(()=>{
          this.scroll.refresh()
        })
      },

      // 更新selectType
      setSelectType(selectType){
        this.selectType = selectType
        // 刷新列表
        this.$nextTick(()=>{
          this.scroll.refresh()
        })
      },

      // // 显示评论列表 
      // needShow(rating){
      //   // console.log('need')//数据初始化加载显示
      //   const {rateType,text} = rating
      //   const {selectType,onlyContent} = this

      //   // 返回布尔值true/false
      //   if(selectType===2){//全选
      //     return !onlyContent || !!text
      //   }else{//部分评价
      //     return selectType === rateType && (!onlyContent || !!text)
      //   }
      // }
    },
    computed:{
      filterRatings(){
        const {ratings,onlyContent,selectType} = this
        return ratings.filter(rating=>{
          const {rateType,text} = rating
          if(selectType===2){
            return !onlyContent || !!text
          }else{
            return selectType===rateType && (!onlyContent || !!text)
          }
        })
      }
    },
   
    components:{
      star,
      split,
      ratingselect
    },

    // filters:{
    //   date(val){
    //     return moment(val).fromat('YYYY-MM-DD HH:mm:ss')
    //   }
    // }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/styuls/mixin.styl"

  .ratings
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 137px
        padding: 6px 0
        width: 137px
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align: center
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
          width: 120px
        .score
          margin-bottom: 6px
          line-height: 28px
          font-size: 24px
          color: rgb(255, 153, 0)
        .title
          margin-bottom: 8px
          line-height: 12px
          font-size: 12px
          color: rgb(7, 17, 27)
        .rank
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
      .overview-right
        flex: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .score-wrapper
          margin-bottom: 8px
          font-size: 0
          .title
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(7, 17, 27)
          .stars
            display: inline-block
            margin: 0 12px
            vertical-align: top
          .score
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(255, 153, 0)
        .delivery-wrapper
          font-size: 0
          .title
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
          .delivery
            margin-left: 12px
            font-size: 12px
            color: rgb(147, 153, 159)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content
          position: relative
          flex: 1
          .name
            margin-bottom: 4px
            line-height: 12px
            font-size: 10px
            color: rgb(7, 17, 27)
          .star-wrapper
            margin-bottom: 6px
            font-size: 0
            .stars
              display: inline-block
              margin-right: 6px
              vertical-align: top
            .delivery
              display: inline-block
              vertical-align: top
              line-height: 12px
              font-size: 10px
              color: rgb(147, 153, 159)
          .text
            margin-bottom: 8px
            line-height: 18px
            color: rgb(7, 17, 27)
            font-size: 12px
          .recommend
            line-height: 16px
            font-size: 0
            .icon-thumb_up,.icon-thumb_down, .item
              display: inline-block
              margin: 0 8px 4px 0
              font-size: 9px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)

            .item
              padding: 0 6px
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px
              color: rgb(147, 153, 159)
              background: #fff
          .time
            position: absolute
            top: 0
            right: 0
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
</style>
