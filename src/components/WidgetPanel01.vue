<template>
  <LayoutPanel>
    <div class="container">
      <div
        v-for="(item, index) in source"
        :key="index"
        :class="{ active: current === index, item: true }"
      >
        <div class="item-label">{{ item.label }}</div>
        <div class="item-value">
          <span class="item-value-text">{{ item.value }}</span>
          <span class="item-value-unit">{{ item.unit }}</span>
        </div>
        <i :class="item.icon" class="item-icon"></i>
      </div>
    </div>
  </LayoutPanel>
</template>
<script setup lang="ts">
import { Random } from "mockjs";
import { LayoutPanel } from "@/layout";
import { ref } from "vue";

const current = ref(0);

setInterval(() => {
  if (current.value < source.length - 1) {
    current.value++;
  } else {
    current.value = 0;
  }
}, 1500);

const source = [
  {
    label: "IMO",
    value: "9876543",
    icon: "fa-solid fa-code",
    status: Random.pick([true, false]),
  },
  {
    label: "船舶名称",
    value: "东方复兴号",
    icon: "fa-solid fa-fingerprint",
    status: Random.pick([true, false]),
  },
  {
    label: "船舶类型",
    value: "集装箱船",
    icon: "fa-solid fa-ship",
    status: Random.pick([true, false]),
  },
  {
    label: "呼号",
    value: "CXYZ",
    icon: "fa-solid fa-phone",
    status: Random.pick([true, false]),
  },
  {
    label: "当前所在港口",
    value: "鹿特丹港",
    icon: "fa-solid fa-anchor",
    status: Random.pick([true, false]),
  },
  {
    label: "下一目标港口",
    value: "汉堡港",
    icon: "fa-solid fa-anchor",
    status: Random.pick([true, false]),
  },
  {
    label: "总吨",
    value: "50,400",
    unit: "吨",
    icon: "fa-solid fa-weight-scale",
    status: Random.pick([true, false]),
  },
  {
    label: "载重吨",
    value: "65,000",
    unit: "吨",
    icon: "fa-solid fa-scale-unbalanced-flip",
    status: Random.pick([true, false]),
  },
  {
    label: "当前航速",
    value: "22.4",
    unit: "节",
    icon: "fa-solid fa-gauge-simple-high",
    status: Random.pick([true, false]),
  },
];
</script>

<style lang="scss" scoped>
$emphasize-color: #74f7fd;
.container {
  box-sizing: border-box;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  height: 100%;
  padding-top: 10px;

  .item {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 12px;
    overflow: hidden;
    background-color: rgba(93, 101, 122, 20%);

    .item-label {
      font-size: 13px;
      color: #999;
      text-align: right;
      transition: all 0.3s ease-in-out;
    }
    .item-value {
      margin-top: 6px;
      font-size: 14px;
      color: #fff;
      text-align: right;
      transition: all 0.3s ease-in-out;
      .item-value-text {
        font-size: 18px;
        font-weight: bold;
      }
      .item-value-unit {
        font-size: 13px;
      }
    }
    .item-icon {
      position: absolute;
      top: 10px;
      right: -10px;
      font-size: 70px;
      color: #ffffff12;
      transition: all 0.3s ease-in-out;
    }

    &.active {
      .item-icon {
        color: #74fab022;
      }
      .item-label,
      .item-value {
        color: $emphasize-color;
      }
    }
  }
}
</style>
