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

const mockData = {
  time: [
    "06/01 08:00",
    "06/01 12:00",
    "06/01 16:00",
    "06/01 20:00",
    "06/02 00:00",
    "06/02 08:00",
    "06/02 16:00",
    "06/02 24:00",
  ],
  remaining: [4200, 3800, 3400, 3000, 2800, 4000, 3600, 3200], // 剩余油量（吨）
  consumptionRate: [120, 115, 125, 110, 105, 130, 120, 115], // 每小时消耗（kg/h）
};

const generateOptions = (sources: any[][]) => ({
  tooltip: { trigger: "axis" },
  legend: {
    data: ["剩余油量", "燃油消耗速率"],
    show: true,
    right: 0,
    textStyle: {
      color: "#fff",
    },
  },
  grid: {
    left: "4%",
    right: "4%",
    bottom: "0%",
    top: "30%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: "#fff",
      margin: 20,
      // rotate: 30,
    },
    data: mockData.time,
  },
  yAxis: [
    {
      name: "剩余油量（吨）",
      type: "value",
      min: 2000,
      max: 5000,
      axisLabel: {
        color: "#c8c8c8",
      },
      splitLine: {
        lineStyle: {
          color: "#c8c8c830",
          type: "dashed",
        },
      },
    },
    {
      name: "消耗速率（kg/h）",
      type: "value",
      min: 80,
      max: 150,
      axisLabel: {
        color: "#c8c8c8",
      },
      splitLine: {
        lineStyle: {
          color: "#c8c8c830",
          type: "dashed",
        },
      },
    },
  ],
  series: [
    {
      name: "剩余油量",
      type: "line",
      data: mockData.remaining,
      symbol: "none",
      // smooth: true,
      lineStyle: {
        normal: {
          width: 2,
          color: "rgba(0, 254, 169, 1)",
        },
      },
      itemStyle: {
        color: "rgba(0, 254, 169, 0.5)",
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgba(31, 218, 163, 0.4)",
          },
          {
            offset: 1,
            color: "rgba(31, 218, 163, 0)",
          },
        ]),
      },
    },
    {
      name: "燃油消耗速率",
      type: "line",
      symbol: "diamond",
      // smooth: true,
      lineStyle: {
        normal: {
          width: 2,
          color: "rgba(87, 153, 214, 1)",
        },
      },
      itemStyle: {
        color: "rgba(87, 153, 214, 1)",
      },
      yAxisIndex: 1,
      data: mockData.consumptionRate,
    },
  ],
});

onMounted(() => {
  nextTick(() => {
    const sources = [
      [859, 571, 612, 906, 866, 984, 212, 931, 749, 993, 276, 477],
      [598, 539, 861, 375, 576, 383, 896, 430, 315, 755, 808, 630],
    ];
    const options = generateOptions(sources);
    setOption(options);
  });
});
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
</style>
