// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import Example from '../../components/Example.vue'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  enhanceApp({app}) {
    // register your custom global components
    app.component('Example', Example)
  }
}