<template>
  <ky-time-line style="margin-top: 40px" :active-method="activeMethod" :data="dataList">
    <ky-time-line-item v-for="(item, index) in dataList" :key="index" :index="index">
      <div class="point-item">
        <div class="img-wrap">
          <img v-show="item.done" src="../assets/point-a.svg" alt=""/>
          <img v-show="!item.done" src="../assets/point.svg" alt=""/>
        </div>
        <div class="content">
          <div class="point-name" :class="{ active: item.done }">{{ item.pointName }}</div>
          <div class="user-wrap" v-if="item.done">
            <div class="user-name text-sm">{{ item.name }}</div>
            <div class="time text-sm">{{ item.time || '--' }}</div>
          </div>
        </div>
      </div>
    </ky-time-line-item>
  </ky-time-line>
</template>

<script setup>
import KyTimeLine from '../components/TimeLine/index.vue'
import KyTimeLineItem from '../components/TimeLine/TimeLineItem.vue'
import {ref} from 'vue'

const dataList = ref(Array(10)
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

function activeMethod(item) {
  return item.done
}

</script>

<style scoped lang="scss">
.point-item {
  box-sizing: border-box;
  width: 200px;

  .img-wrap {
    width: 52px;
    background: #fff;

    img {
      width: 20px;
      display: block;
      margin: -12px auto 10px;
    }
  }

  .content {
    .point-name {
      color: #9b9fac;
      font-size: 14px;
      padding-left: 16px;

      &.active {
        color: #131523;
      }
    }

    .user-wrap {
      width: 175px;
      margin-top: 14px;
      padding: 16px;
      border-radius: 2px;
      background: #f3f5f8;
    }

    .user-name {
      color: #606576;
    }

    .time {
      margin-top: 8px;
      color: #606576;
      white-space: nowrap;
    }
  }
}
</style>