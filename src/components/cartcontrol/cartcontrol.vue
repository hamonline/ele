<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease icon-remove_circle_outline"
          v-if='food.count' @click.stop="updateFoodCount(food,false,$event)">
          <!-- 取消冒泡 -->
      </div>
    </transition>
    <div class="cart-count" v-show='food.count'>{{food.count}}</div>
    <div class="cart-add icon-add_circle"
         @click.stop="updateFoodCount(food,true,$event)"></div>
         <!-- 因为该组件在goods.vue显示，updateFoodCount()该方法是在显示food数据，
              要遵循：数据定义和数据方法绑定一致原则，所以该方法应该由goods.vue定义后传到该组件 -->
         <!--food：具体选项，true：增加/flase:减少，$event:过滤pc端原生click事件  -->
  </div>

</template>
<script>
  export default {
    props:{
      food:Object,
      updateFoodCount:Function
    }
   } 
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
      &.move-enter-active, &.move-leave-active
        transition: all .4s linear
      &.move-enter, &.move-leave-active
        opacity: 0
        //使用translate3d 可以解决GPU加速
        transform: translate3d(24px, 0, 0) rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
</style>

