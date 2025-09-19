<template>
  <Layout>
    <template #left>
      <WidgetPanel01 title="船舶信息" />
      <WidgetPanel02 title="货物装卸统计" />
      <WidgetPanel03 title="主机 " />
    </template>
    <template #right>
      <WidgetPanel04 title="航行状态" />
      <WidgetPanel05 title="燃油管理" />
      <WidgetPanel06 title="偏航角度监测" />
    </template>
    <template #middle>
      <div ref="container" style="width: 100%; height: 100%"></div>
    </template>
  </Layout>
</template>
<script setup lang="ts">
import { provide } from "vue";
import {
  WidgetPanel01,
  WidgetPanel02,
  WidgetPanel03,
  WidgetPanel04,
  WidgetPanel05,
  WidgetPanel06,
} from "@/components";
import { Layout } from "@/layout";
import { useShip } from "@/hooks";

const { container } = useShip();

provide("events", {});
</script>
