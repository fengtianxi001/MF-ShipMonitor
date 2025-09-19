<template>
  <LayoutPanel>
    <div class="container">
      <div
        v-for="(item, index) in source"
        :key="index"
        :class="{ error: item.status, item: true }"
      >
        <div class="item-label">{{ item.label }}</div>
        <div class="item-value">
          <span class="item-value-text">{{ item.value }}</span>
          <span class="item-value-unit">{{ item.unit }}</span>
        </div>
        <i class="item-icon-alert fa-solid fa-triangle-exclamation"></i>
      </div>
    </div>
  </LayoutPanel>
</template>
<script setup lang="ts">
import { Random } from "mockjs";
import { LayoutPanel } from "@/layout";

const source = [
  {
    label: "进油粘度",
    value: "12",
    unit: "cSt",
    status: Random.pick([true, false]),
  },
  {
    label: "当前燃料类型",
    value: "HFO",
    unit: "重油",
    status: Random.pick([true, false]),
  },
  {
    label: "轴功率",
    value: "18903",
    unit: "KW",
    status: Random.pick([true, false]),
  },
  {
    label: "负荷率",
    value: "40.8",
    unit: "%",
    status: Random.pick([true, false]),
  },
  {
    label: "主机转速",
    value: "46",
    unit: "rpm",
    status: Random.pick([true, false]),
  },
  {
    label: "1#缸压缩压力",
    value: "12.3",
    unit: "bar",
    status: Random.pick([true, false]),
  },
  {
    label: "冷却水温度",
    value: "82",
    unit: "摄氏度",
    status: Random.pick([true, false]),
  },
  {
    label: "扫气压力",
    value: "1.8",
    unit: "bar",
    status: Random.pick([true, false]),
  },
  {
    label: "排气温度",
    value: "310",
    unit: "摄氏度",
    status: Random.pick([true, false]),
  },
];
</script>

<style lang="scss" scoped>
.container {
  box-sizing: border-box;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  height: 100%;
  padding-top: 10px;

  $icon-size: 34px;
  .item {
    position: relative;
    box-sizing: border-box;
    display: flex;
    grid-gap: 10px;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 12px;
    overflow: hidden;
    background-color: rgba(93, 101, 122, 20%);
    .item-label {
      width: 30px;
      font-size: 13px;
      color: #999;
      text-align: right;
    }
    .item-value {
      width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
      justify-content: right;
      align-items: end;
      font-size: 14px;
      color: #fff;
      .item-value-text {
        font-size: 22px;
        font-weight: bold;
      }
      .item-value-unit {
        font-size: 13px;
      }
    }
    .item-icon-alert {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 70px;
      color: #e5616109;
    }
    &.error {
      .item-icon-alert {
        color: #ff978920;
      }
      .item-value-text {
        color: #ff9689;
      }
      .item-value-unit {
        color: #ff9789b3;
      }
    }
  }
}
</style>
