<template>
  <LayoutPanel>
    <div class="wrap">
      <div ref="container" class="item-list">
        <div
          v-for="{ label, value, status, time } in list"
          :key="time"
          :class="{ error: status === 0, item: true }"
        >
          <div class="item-circle"></div>
          <div class="item-label">{{ label }}</div>
          <div class="item-value">{{ value }}</div>
          <div class="item-time">{{ time }}</div>
        </div>
      </div>
    </div>
  </LayoutPanel>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { LayoutPanel } from "@/layout";

const list = ref([
  {
    label: "横倾角度",
    value: "15°",
    status: 1,
    time: "2025/07/04 12:34:56",
  },
  {
    label: "纵倾角度",
    value: "18°",
    status: 1,
    time: "2025/07/04 12:34:56",
  },
  {
    label: "风速",
    value: "20 m/s",
    status: 0,
    time: "2025/07/04 12:34:56",
  },
  {
    label: "风向",
    value: "东南",
    status: 1,
    time: "2025/07/04 12:34:56",
  },
  {
    label: "浪高",
    value: "20 m",
    status: 0,
    time: "2025/07/04 12:34:56",
  },
  {
    label: "航速",
    value: "25 km/h",
    status: 1,
    time: "2025/07/04 12:34:56",
  },
  {
    label: "吃水深度",
    value: "5 m",
    status: 0,
    time: "2025/07/04 12:34:56",
  },
  {
    label: "涌浪方向",
    value: "西北",
    status: 1,
    time: "2025/07/04 12:34:56",
  },
  {
    label: "涌浪周期",
    value: "6 s",
    status: 1,
    time: "2025/07/04 12:34:56",
  },
  {
    label: "横摇周期",
    value: "4 s",
    status: 1,
    time: "2025/07/04 12:34:56",
  },
  {
    label: "海水温度",
    value: "22°C",
    status: 1,
    time: "2025/07/04 12:34:56",
  },
  {
    label: "能见度",
    value: "10 km",
    status: 1,
    time: "2025/07/04 12:34:56",
  },
  {
    label: "气压",
    value: "1013 hPa",
    status: 1,
    time: "2025/07/04 12:34:56",
  },
]);

const container = ref();

let timer: any;
onMounted(() => {
  if (timer) window.clearInterval(timer);
  timer = setInterval(() => {
    container.value.classList.add("scroll");
    setTimeout(() => {
      if (!timer) return void 0;
      container.value.classList.remove("scroll");
      list.value.push(list.value.shift());
    }, 2000);
  }, 3000);
});
</script>

<style lang="scss" scoped>
@keyframes row-out {
  from {
    top: 0;
  }
  to {
    top: -36px;
  }
}
.wrap {
  height: 100%;
  overflow: hidden;
}
.item-list {
  display: flex;
  flex-direction: column;
  grid-gap: 8px;
  height: 670px;

  // overflow: hidden;
  &.scroll {
    position: relative;
    animation: row-out 1s linear forwards;
    .row:first-child {
      opacity: 0;
      transition: opacity 1s;
    }
  }
  .item {
    position: relative;
    display: flex;
    align-items: center;
    padding: 5px;
    font-size: 16px;
    background: linear-gradient(90deg, #74fabd22, transparent);
    &.error {
      background: linear-gradient(90deg, #e38d7022, transparent);
      .item-circle {
        background-color: #e38d70;
      }
    }
    .item-circle {
      position: absolute;
      left: 10px;
      width: 5px;
      height: 10px;
      background-color: #74fabd;
    }
    .item-label {
      width: 25%;
      padding-left: 15px;
    }
    .item-value {
      width: 20%;
    }
    .item-time {
      width: 55%;
      text-align: end;
    }
  }
}
</style>
