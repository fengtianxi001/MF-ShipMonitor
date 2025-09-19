<template>
  <LayoutPanel>
    <div ref="container" class="container"></div>
  </LayoutPanel>
</template>
<script setup lang="ts">
import { nextTick, onMounted } from "vue";
import { LayoutPanel } from "@/layout";
import { useEcharts } from "@/hooks";

const { container, echarts, setOption } = useEcharts();

const generateOptions = () => ({
  legend: {
    show: true,
    right: 0,
    textStyle: {
      color: "#fff",
    },
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "#000",
    borderColor: "#333",
    textStyle: {
      color: "#fff",
    },
  },
  grid: {
    left: "4%",
    right: "4%",
    bottom: "0%",
    top: "20%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: "#fff",
      margin: 10,
    },
    data: ["青岛港", "上海港", "宁波港", "新加坡港", "鹿特丹港", "汉堡港"],
  },
  yAxis: {
    type: "value",
    name: "集装箱数量(TEU)",
    axisLabel: {
      color: "#fff",
    },
    splitLine: {
      lineStyle: {
        color: "#c8c8c830",
        type: "dashed",
      },
    },
  },
  series: [
    {
      name: "装货量",
      type: "bar",
      emphasis: { focus: "series" },
      data: [120, 350, 580, 420, 300, 150],
      barWidth: 10,
      barGap: "20%",
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(0, 254, 169, 1)" },
          { offset: 1, color: "rgba(0, 254, 169, 0.1)" },
        ]),
      },
    },
    {
      name: "卸货量",
      type: "bar",
      emphasis: { focus: "series" },
      data: [80, 220, 400, 500, 380, 200],
      barWidth: 10,
      barGap: "20%",
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(87, 153, 214, 1)" },
          { offset: 1, color: "rgba(87, 153, 214, 0.1)" },
        ]),
      },
    },
  ],
});

nextTick(() => {
  const options = generateOptions();
  setOption(options);
});
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
</style>
