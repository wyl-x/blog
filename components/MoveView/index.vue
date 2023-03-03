<template>
  <div
    ref="containerRef"
    :style="{
      transform: `translateY(-${offset}px)`
    }"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
    @wheel.prevent="handleMouseWheel"
  >
    <div v-if="movable">
      <slot></slot>
    </div>

    <div ref="contentRef">
      <slot></slot>
    </div>

    <div v-if="movable">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { throttle } from 'lodash'
import { defineProps, nextTick, onMounted, ref, useSlots, watch } from 'vue'

/**
 功能：页面内容滚动显示
 */
const props = defineProps({
  // 外层容器高度分几次滚动,例如 `step=2` 表示每次滚动 1/2
  step: {
    type: Number,
    default: 1
  },

  // 指定单次滚动长度,此属性会覆盖 `step` 属性
  distance: {
    type: Number
  },

  // 滚动动画持续时间(ms)
  duration: {
    type: Number,
    default: 500
  },

  // 滚动间隔时间(ms)
  interval: {
    type: Number,
    default: 3000
  },

  // 鼠标滚轮控制滚动
  mousewheel: {
    type: Boolean,
    default: true
  },

  // 跟随滚轮滚动时，滚动一格需要的时间, 时间越小滚动越快
  mousewheelSpeed: {
    type: Number,
    default: 200
  }
})

const slots = useSlots()

const contentRef = ref()
let contentHeight = 0

const containerRef = ref()
// container滚动长度
const offset = ref(0)
// container单次滚动长度
const moveDistance = ref(0)

let timer = 0
let rafTimer = 0

// 是否需要滚动
let movable = ref(false)
let pause = false

onMounted(() => {
  init()
})

watch(
  () => slots.default(),
  () => {
    nextTick(init)
  },
  { deep: true }
)

function init() {
  // clearTimeout(timer)
  const contentEl = contentRef.value
  contentHeight = contentEl.offsetHeight

  const containerEl = containerRef.value
  const parentNode = containerEl.parentNode
  parentNode.style.overflow = 'hidden'
  const parentHeight = parentNode.clientHeight

  // 父元素高度足够，不用滚动
  if (parentHeight >= contentHeight) {
    offset.value = 0
    movable.value = false
    clearTimeout(timer)
    return
  }

  if (movable.value) {
    return
  }

  movable.value = true

  // 初始化位置
  offset.value = contentHeight

  // 计算单次滚动距离
  moveDistance.value = props.distance || parentHeight / props.step
  timer = setTimeout(startMove, props.interval)
}

let isMoving = false
async function startMove() {
  if (pause || isMoving) {
    return
  }
  if (!contentHeight) {
    return
  }
  if (offset.value >= contentHeight * 2) {
    // 重置位置
    offset.value = contentHeight
    startMove()
  } else {
    // console.log('startMove', new Date())
    clearTimeout(timer)
    // 修正位置
    const position = offset.value - (offset.value % moveDistance.value)
    await animateTo(position + moveDistance.value, props.duration)
    timer = setTimeout(startMove, props.interval)
  }
}

/**
 * 滚动到指定位置
 * @param target
 */
function animateTo(target, duration) {
  if (duration === 0) {
    offset.value = target
    return
  }
  isMoving = true
  return new Promise((resolve) => {
    // 距离
    const delta = target - offset.value

    // 速度
    const velocity = delta / duration

    let start = Date.now()
    let lastTime = start

    function raf() {
      rafTimer = requestAnimationFrame(() => {
        const now = Date.now()
        if (now - start >= duration || (delta > 0 && offset.value >= target) || (delta < 0 && offset.value <= target)) {
          offset.value = target
          isMoving = false
          resolve()
          return
        }

        offset.value += velocity * (now - lastTime)
        lastTime = now
        raf()
      })
    }

    raf()
  })
}

async function mouseWheelMove(deltaY, type) {
  if (type === 'down') {
    if (offset.value >= contentHeight * 2) {
      offset.value = contentHeight
    }
  }

  if (type === 'up') {
    if (offset.value <= 0) {
      offset.value = contentHeight
    }
  }

  await animateTo(offset.value + deltaY, props.mousewheelSpeed)
  startMove()
}

const handleMouseWheel = throttle(scrollBarWheel, props.mousewheelSpeed, { leading: true, trailing: false })

function scrollBarWheel(e) {
  if (!movable.value || !props.mousewheel) {
    return
  }

  // 鼠标滚动时取消自动滚动
  cancelAnimationFrame(rafTimer)
  isMoving = false

  e = e || window.event
  if (e.wheelDelta) {
    //判断浏览器IE，谷歌滑轮事件
    // console.log(e.deltaY, e.wheelDelta)

    if (e.wheelDelta > 0) {
      //当滑轮向上滚动时
      mouseWheelMove(-moveDistance.value, 'up')
    }
    if (e.wheelDelta < 0) {
      mouseWheelMove(moveDistance.value, 'down')
    }
  } else if (e.detail) {
    //Firefox滑轮事件
    if (e.detail > 0) {
      //当滑轮向上滚动时
      mouseWheelMove(-moveDistance.value, 'up')
    }
    if (e.detail < 0) {
      mouseWheelMove(moveDistance.value, 'down')
    }
  }
}

function handleMouseenter() {
  if (!movable.value) {
    return
  }
  pause = true
}

function handleMouseleave() {
  if (!movable.value) {
    return
  }
  pause = false
  startMove()
}
</script>
