<template>
  <div
    style="position: absolute"
    :style="{
      top: `${itemPositions[index]?.y}px`,
      left: `${itemPositions[index]?.x}px`
    }"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps, inject } from 'vue'

const itemPositions = inject('itemPositions')
defineProps({
  index: {
    type: Number,
    required: true
  }
})
</script>

<style scoped></style>
