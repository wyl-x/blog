<template>
  <div class="wrap">
    <move-view
      :interval="2000"
      :duration="1500"
      :step="5">
      <div class="list-item"
           v-for="item in dataList"
           :key="item.pointName">
        {{ item.pointName }}
      </div>
    </move-view>
  </div>
</template>

<script setup>
import MoveView from '../components/MoveView/index.vue'
import {ref} from 'vue';

const dataList = ref(Array(6)
  .fill(0)
  .map((item, index) => {
    return {
      pointName: `点位 ${index + 1}`,
      name: `光头强 ${index + 1}`,
      time: `2023-01-01`,
      done: index < 5
    }
  })
)
</script>

<style scoped lang="scss">
.wrap {
  height: 500px;
  border: 1px solid;
  box-sizing: content-box;
}

.list-item {
  box-sizing: border-box;
  border: 1px dashed #666;
  height: 100px;
  line-height: 100px;
  padding-left: 20px;
}
</style>