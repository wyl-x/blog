<template>
  <div>{{foo}}</div>
</template>

<script setup>
import {ref} from "vue";

const foo = ref(0)

setInterval(() => {
  foo.value ++
}, 1000)
</script>

<style scoped>

</style>