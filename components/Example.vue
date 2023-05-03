<template>
  <ClientOnly>
    <div class="yl-card">
      <div style="font-weight:bold;" v-if="description">{{ description }}</div>
      <hr>
      <component :is="Comp"></component>
      <hr>

      <div style="display: flex;justify-content: flex-end">
        <div @click="toggleCode" class="yl-button">
          <div class="yl-box">查</div>
          <div class="yl-box">看</div>
          <div class="yl-box">源</div>
          <div class="yl-box">码</div>
        </div>
      </div>


      <pre v-show="codeVisible" class="theme-atom-one-dark"><code class="hljs" v-html="highlightedCode"></code></pre>
    </div>
  </ClientOnly>
</template>

<script setup>
// Using ES6 import syntax
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.min.css';
import {ref} from 'vue';
import './example.css'

const modules = import.meta.glob('../examples/*.vue', {eager: true})

const props = defineProps({
  source: String,
  path: String,
  description: String,
})

let Comp
Object.keys(modules).forEach(key => {
  if (key.includes(props.path)) {
    Comp = modules[key].default
  }
})

const sourceCode = decodeURIComponent(props.source)
const highlightedCode = hljs.highlight(sourceCode, {language: 'xml'}
).value

const codeVisible = ref(false)

function toggleCode() {
  codeVisible.value = !codeVisible.value
}
</script>

<style>
.VPDoc.has-aside .content-container {
    max-width: 100% !important;
}

.VPDoc .container .content {
    padding: 0 10px 128px !important;
}
</style>