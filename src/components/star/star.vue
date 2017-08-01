<template>
  <!--<div class="stars stars-48">
    <span class="star on"></span>
    <span class="star on"></span>
    <span class="star on"></span>
    <span class="star half"></span>
    <span class="star off"></span>
  </div>-->
  <div class="stars" :class="`stars-${size}`">
    <span class="star" v-for="sc in starClasses" :class="sc"></span>
  </div>
</template>
<script>


//  定义常量
const CLASS_ON = 'on'
const CLASS_OFF= 'off'
const CLASS_HALF = 'half'

export default {
  /*props:{
    score:Number,
    size:Number
  },*/
  props:['score','size'],
  /*
   5
   3.4 -->3全2灰
   3.5-->3全1半1灰
   */
//  计算属性  计算星星的个数
  computed: {
    starClasses() {
//      定义一个空数组
      const stars = []

//      处理数组中的数据
      const score = this.score
      const scoreInteger = Math.floor(score)//对分数向下取整
//      添加整星CLASS_ON 到数组
      for (var i=0;i<scoreInteger;i++){
        stars.push(CLASS_ON)
      }
//      添加半星 CLASS_HALF
      if(score-scoreInteger>=0.5){
        stars.push(CLASS_HALF)
      }
//       添加灰星 CLASS_OFF
      while(stars.length<5){//在前面的基础上判断 此时数组是否已满 5个星星
        // 没有则说明上面条件都不满足，则应该为灰星
        stars.push(CLASS_OFF)
      }
//      或者用for循环
     /* let len = 5-scoreInteger
      for(var i=0;i<len;i++){
        stars.push(CLASS_OFF)
      }*/
      console.log(this.size,typeof this.size)

//      返回这个数组
      return stars
    }
  },
data () {
return {}
},
methods: {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  //  引入混合 星星bg-img 的styl文件
  @import "../../common/styuls/mixin.styl"
  .stars
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
        // &.on
        //   bg-image("../../components/star/star48_on")
        // &.half
        //   bg-image("star48_half")
        // &.off
        //   bg-image("../star/star48_off")
        &.on
          bg-image("../../components/star/star48_on")
        &.half
          bg-image("./star48_half")
        &.off
          bg-image("./star48_off")
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


</style>