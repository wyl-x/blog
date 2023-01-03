<template>
  <div ref="containerRef" style="position: relative">
    <canvas className="canvas" ref="canvasRef"></canvas>
    <slot></slot>
  </div>
</template>

<script setup name="KyTimeLine">
import { ref, onMounted, provide, watch, onBeforeUnmount } from 'vue'
import { throttle } from 'lodash'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  color: {
    type: String,
    default: '#DEE2E9'
  },
  activeMethod: {
    type: Function
  },
  activeColor: {
    type: String,
    default: '#3685FB'
  },
  lineWidth: {
    type: Number,
    default: 2
  },
  padding: {
    type: Number,
    default: 20
  },
  itemWidth: {
    type: Number,
    default: 200
  },
  itemHeight: {
    type: Number,
    default: 180
  },
  offset: {
    type: Number,
    default: 60
  },
  borderRadius: {
    type: Number,
    default: 5
  }
})

const containerRef = ref(null)
const canvasRef = ref(null)
let ctx
let canvasWidth = 0

const padding = props.padding

const itemWidth = props.itemWidth
const itemHeight = props.itemHeight

const offset = props.offset
const radius = props.borderRadius

function renderTimeLine() {
  canvasWidth = containerRef.value.clientWidth
  const minWidth = itemWidth * 2 + offset + padding * 2 + radius
  if (canvasWidth < minWidth) {
    canvasWidth = minWidth
  }
  const itemsPerLine = Math.floor((canvasWidth - offset - padding * 2 - radius) / itemWidth)
  // console.log('itemsPerLine', itemsPerLine)
  const canvasHeight = Math.ceil(props.data.length / itemsPerLine) * itemHeight

  const canvas = canvasRef.value
  canvas.style.minWidth = minWidth + 'px'
  canvas.style.width = canvasWidth + 'px'
  canvas.style.height = canvasHeight + 'px'
  canvas.width = canvasWidth
  canvas.height = canvasHeight

  console.log('canvasWidth', canvasWidth)
  drawPointLine(ctx)
}

const handleResize = throttle(renderTimeLine, 200)
window.addEventListener('resize', handleResize)

watch(() => props.data, renderTimeLine)
onMounted(() => {
  const canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  renderTimeLine()
  window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

const itemPositions = ref([])
provide('itemPositions', itemPositions)
let posX
let posY

function drawPointLine(ctx) {
  let increase = true
  posX = padding + offset
  posY = padding
  itemPositions.value = []
  ctx.lineWidth = props.lineWidth

  ctx.moveTo(posX, posY)
  props.data.forEach((item, index) => {
    itemPositions.value.push({ x: posX, y: posY + props.lineWidth })

    if (index === props.data.length - 1) return

    ctx.beginPath()
    ctx.moveTo(posX, posY)

    ctx.strokeStyle = props.color
    if (typeof props.activeMethod === 'function' && props.activeColor) {
      const lastItem = props.data[index + 1]
      if (lastItem && props.activeMethod(lastItem)) {
        ctx.strokeStyle = props.activeColor
      }
    }

    if (increase) posX += itemWidth
    else posX -= itemWidth

    if (posX > canvasWidth - itemWidth - padding - radius) {
      const lastPos = posX - itemWidth
      posX = canvasWidth - padding - radius
      drawLine()

      // 右上圆角
      ctx.arcTo(posX + radius, posY, posX + radius, posY + radius, radius)

      posX += radius
      posY += itemHeight - radius
      drawLine()

      // 右下圆角
      ctx.arcTo(posX, posY + radius, posX - radius, posY + radius, radius)

      posX = lastPos
      posY += radius
      drawLine()
      increase = false
    } else if (posX < padding + radius) {
      const lastPos = posX + itemWidth

      posX = padding + radius
      drawLine()

      // 左上圆角
      ctx.arcTo(posX - radius, posY, posX - radius, posY + radius, radius)

      posX -= radius
      posY += itemHeight - radius
      drawLine()

      // 左下圆角
      ctx.arcTo(posX, posY + radius, posX + radius, posY + radius, radius)

      posX = lastPos
      posY += radius
      drawLine()
      increase = true
    } else {
      drawLine()
    }

    ctx.stroke()
  })
}

function drawLine() {
  ctx.lineTo(posX, posY)
}
</script>
