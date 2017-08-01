<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <!--<img src="http://static.galileo.xiaojukeji.com/static/tms/seller_avatar_256px.jpg" width="64" height="64">-->
        <img :src="seller.avatar" width="64" height="64">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <!--<span class="name">粥品香坊（回龙观）</span>-->
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          <!--蜂鸟专送/38分钟送达-->
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <!--如果返回数据 则会执行图标显示 否则不执行下面语句-->
        <div class="supports" v-if="seller.supports">
          <span class="icon" :class="supportClasses[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
          <!--<span class="text">在线支付 满28送张晓飞</span>-->
        </div>
      </div>
      <div class="supports-count" v-if="seller.supports" @click="showMask(true)">
        <span class="count">{{seller.supports.length}}个</span>
        <span class="icon-keyboard_arrow_right"></span>
      </div>
    </div>
    <div class="bulletin-wrapper"  @click="showMask(true)">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">
         {{seller.bulletin}}
        <!--粥品香坊其烹饪粥料的秘方源于中国千年古法，在融和现代制作工艺，由世界烹饪大师屈浩先生领衔研发。坚守纯天然、0添加的良心品质深得消费者青睐，发展至今成为粥类的引领品牌。是2008年奥运会和2013年园博会指定餐饮服务商。-->
      </span>
      <span class="icon-keyboard_arrow_right"></span>
    </div>
    <div class="background">
      <img src="http://static.galileo.xiaojukeji.com/static/tms/seller_avatar_256px.jpg" width="100%" height="100%">
    </div>
    <transition name='fade'>
     <div class="mask" v-show="isShow">
      <div class="mask-wrapper clearfix">
        <div class="mask-main">
          <h1 class="title">{{seller.name}}</h1>
          <div class="star-wrapper">
            <!--在star里传的size是Number型 所以这里要加： 绑定数据，如果传的是string类型，则可以不必加-->
            <!--绑定数据size是number-->
            <!--<star :score="seller.score" :size= 48></star>-->
            <star :score="seller.score" :size= '48'></star>
            <!--绑定数据size是string-->
            <!--<star :score="seller.score" size= 48></star>-->
            <!--<star :score="seller.score" size= '48'></star>-->

            <!--<div class="stars stars-48">-->
              <!--<span class="star on"></span>-->
              <!--<span class="star on"></span>-->
              <!--<span class="star on"></span>-->
              <!--<span class="star half"></span>-->
              <!--<span class="star off"></span>-->
            <!--</div>-->
          </div>
          <div class="info">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <!-- <ul class="list">
            <li class="item">
              <span class="icon decrease"></span>
              <span class="text">在线支付满10送2个小飞张</span>
            </li>
            <li class="item">
              <span class="icon discount"></span>
              <span class="text">VC无限橙果汁全场8折</span>
            </li>
            <li class="item">
              <span class="icon guarantee"></span>
              <span class="text">单人精彩套餐</span>
            </li>
            <li class="item">
              <span class="icon invoice"></span>
              <span class="text">该商家支持发票,请下单写好发票抬头</span>
            </li>
            <li class="item">
              <span class="icon special"></span>
              <span class="text">已加入“外卖保”计划,食品安全保障</span>
            </li>
          </ul> -->
          <ul class="list">
            <li class="item" v-for="support in seller.supports">
              <!--<span class="icon decrease"></span>-->
              <span class="icon" :class="supportClasses[support.type]"></span>
              <span class="text">{{support.description}}</span>
            </li>
          </ul>
          <div class="info">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletin">
            <p class="text">
              {{seller.bulletin}}
              <!--粥品香坊其烹饪粥料的秘方源于中国千年古法，在融和现代制作工艺，由世界烹饪大师屈浩先生领衔研发。坚守纯天然、0添加的良心品质深得消费者青睐，发展至今成为粥类的引领品牌。是2008年奥运会和2013年园博会指定餐饮服务商。-->
            </p>
          </div>
        </div>
      </div>
      <div class="mask-footer">
        <span class="icon-close" @click="showMask(false)"></span>
      </div>
     </div>
    </transition>
   
  </div>
</template>

<script>
//  引入star组件路由
  import star from '../star/star.vue'

  export default {
//    接受App.vue传递的属性
    props:{
      seller:Object
    },
    data(){
      return {
        isShow:false,
        supportClasses: ["decrease", "discount", "guarantee", "invoice", "special"]
      }
    },
    methods: {
      showMask (isMask) {
        this.isShow = isMask
      }
    },
    components:{
      star
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/styuls/mixin.styl"
  .header
    position relative
    color #fff
    background-color rgba(7,17,27,.5)
    overflow hidden
    .content-wrapper
      position relative
      padding 24px 12px 18px 24px
      font-size 0
      .avatar
        display inline-block
        vertical-align top
      .content
        display inline-block
        margin-left 16px
        .title
          margin 2px 0  8px 0
          .brand
            display inline-block
            width 30px
            height 18px
            bg-image(brand)
            background-size 30px 18px
            background-repeat no-repeat
            vertical-align top
           /* background-image url(brand@2x.png)
            background-image url(brand@3x.png)*/
          .name
            margin-left 6px
            font-size 16px
            font-weight bold
            line-height 18px
        .description
          font-size 12px
          line-height 12px
          font-weight 200
        .supports
          margin 10px 0 2px 0
          .icon
            display inline-block
            width 12px
            height 12px
            background-size 12px 12px
            background-repeat no-repeat
            vertical-align top
            &.decrease
              bg-image(decrease_1)
            &.discount
              bg-image(discount_1)
            &.guarantee
              bg-image(guarantee_1)
            &.invoice
              bg-image(invoice_1)
            &.special
              bg-image(special_1)
          .text
            margin-left 4px
            font-size 10px
            line-height 12px
            font-weight 200
      .supports-count
        position absolute
        right 12px
        bottom 15px
        height 10px
        line-height 10px
        padding 7px 8px
        border-radius 10px
        background-color rgba(0,0,0,.2)
        .count
          font-size 10px
          line-height 10px
          font-weight 200
        .icon-keyboard_arrow_right
          font-size 10px
          line-height 10px
          font-weight 200
    .bulletin-wrapper
      position relative
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
      padding 0 22px 0 12px
      background-color rgba(7,17,27,.2)
      .bulletin-title
        display inline-block
        width 22px
        height 12px
        vertical-align top
        margin-top 7px
        background-size 22px 12px
        background-repeat no-repeat
        bg-image(bulletin)
      .bulletin-text
        font-size 10px
        line-height 28px
        font-weight 200
      .icon-keyboard_arrow_right
        position absolute
        right 12px
        bottom 0
        font-size 10px
        line-height 28px
        font-weight 200
    .background
      position absolute
      left 0
      top 0
      filter:blur(10px)
      z-index -1
      width 100%
      height 100%

    .mask
      position fixed
      z-index 99
      left:0
      top:0
      width 100%
      height 100%
      background-color rgba(7,17,27,.8)
      overflow auto
      &.fade-enter-active
      &.fade-leave-active
        transition :opacity .5s
      &.fade-enter
      &.fade-leave-to 
        opacity : 0 
      .mask-wrapper
        min-height 100%
        .mask-main
          padding-top 64px
          padding-bottom 64px
          .title
            text-align center
          .star-wrapper
            margin 16px 0 28px 0
            /*.stars
              text-align center
              height 24px
              .star
                display inline-block
                background-repeat no-repeat
              &.stars-48
                .star
                  margin-right 15px
                  width 20px
                  height 19px
                  background-size 20px 19px
                  &:last-child
                    margin-right 0px
                  &.on
                    bg-image("../star/star48_on")
                  &.half
                    bg-image("../star/star48_half")
                  &.off
                    bg-image("../star/star48_off")
              &.stars-36
                .star
                  margin-right 12px
                  width 15px
                  height 15px
                  background-size 15px 15px
                  &:last-child
                    margin-right 0px
                  &.on
                    bg-image("../star/star36_on")
                  &.half
                    bg-image("../star/star36_half")
                  &.off
                    bg-image("../star/star36_off")
              &.stars-24
                .star
                  margin-right 10px
                  width 10px
                  height 10px
                  background-size 10px 10px
                  &:last-child
                    margin-right 0px
                  &.on
                    bg-image("../star/star24_on")
                  &.half
                    bg-image("../star/star24_half")
                  &.off
                    bg-image("../star/star24_off")

*/
          .info
            display flex
            width 80%
            margin 0 auto
            .text
              margin 0 12px
            .line
              position relative
              top 8px
              flex 1
              height 1px
              background-color rgba(255,255,255,.2)
          .list
            width 80%
            margin 24px auto 28px auto
            .item
              margin-bottom 12px
              &:last-child
                margin-bottom 0
              .icon
                vertical-align top
                display inline-block
                width 16px
                height 16px
                background-size 16px 16px
                background-repeat no-repeat
                &.decrease
                  bg-image(decrease_2)
                &.discount
                  bg-image(discount_2)
                &.guarantee
                  bg-image(guarantee_2)
                &.invoice
                  bg-image(invoice_2)
                &.special
                  bg-image(special_2)
              .text
                font-size 12px
                line-height 12px
                font-weight 200
          .bulletin
            width 80%
            margin 24px auto 0 auto
            .text
              font-size 12px
              line-height 24px
              font-weight 200
      .mask-footer
        margin-top -64px
        text-align center
        .icon-close
          font-size 32px
          color rgba(255,255,255,.5)

</style>
