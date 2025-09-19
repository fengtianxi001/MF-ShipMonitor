<template>
  <div class="widget-label">
    <div class="widget-label-item">{{ name }}</div>
  </div>
</template>
<script setup lang="ts">
interface PropsType {
  name: string;
}
const props = defineProps<PropsType>();

const onClick = () => {};
</script>
<style lang="scss" scoped>
.widget-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 8px;
  height: 8px;
  background-color: #73f8ae;
  border-radius: 50%;
  position: relative;
  &:before,
  &:after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    border: 1px solid #73f8ae;
    border-radius: 50%;
    animation: warn 1.2s ease-out 0s infinite; //添加动画
  }

  .widget-label-item {
    text-wrap: nowrap;
    position: absolute;
    top: 10px;
    left: 10px;
    width: auto;
    padding: 10px;
    color: #fff;
    background-color: #00000099;
    overflow: hidden;
    &::before {
      content: "";
      position: absolute;
      top: -7.5px;
      left: -7.5px;
      width: 15px;
      height: 15px;
      background-color: #73f8ae;
      transform: rotate(45deg);
    }
    // border-top: 1px solid #73f8ae;
    // border-left: 1px solid #73f8ae;
  }
}

@keyframes warn {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  25% {
    transform: scale(1);
    opacity: 0.75;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  75% {
    transform: scale(2);
    opacity: 0.25;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}
</style>
