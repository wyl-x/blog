import {defineConfig} from 'vitepress'
import {mdPlugin} from './config/plugin'
import path from 'path'
import {globSync} from 'glob'

//  'src/note/web3/web3js.md',
//  'src/components/data/move-view.md'
function getSideBar() {
  const files = globSync('src/**/*.md', {posix: true})
  const sidebar = {
    components: [],
    note: [],
  }

  files.forEach(filePath => {

    if (filePath.startsWith('src/components')) {

      const text = filePath.replace(/src\/components\/(.*)\/.*/, '$1')
      const link = filePath.replace(/^.*\/(.*).md$/, '$1')
      const childTtem = {link: `/${text}/${link}`, text: link}
      const
        base = '/components'

      const findExistsItem = sidebar.components.find(item => item.text === text)
      if (findExistsItem) {
        findExistsItem.items.push(childTtem)
      } else {
        sidebar.components.push({
          text,
          base,
          items: [
            childTtem
          ]
        })
      }

    }

    if (filePath.startsWith('src/note')) {

      const text = filePath.replace(/src\/note\/(.*)\/.*/, '$1')
      const link = filePath.replace(/^.*\/(.*).md$/, '$1')
      const childTtem = {link: `/${text}/${link}`, text: link}

      const base = '/note'

      const findExistsItem = sidebar.note.find(item => item.text === text)
      if (findExistsItem) {
        findExistsItem.items.push(childTtem)
      } else {
        sidebar.note.push({
          text,
          base,
          items: [
            childTtem
          ]
        })
      }

    }
  })
  return sidebar
}


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "组件库",
  description: "A VitePress Site",
  srcDir: 'src',
  base: '/blog/',
  assetsDir: 'assets',
  vite: {
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        '@': path.resolve(__dirname, '../example')
      }
    },
  },
  markdown: {
    config: (md) => mdPlugin(md),
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: 'Home', link: '/'},
      {text: '组件', link: 'components/data/timeline', activeMatch: '/components/'},
      {text: '笔记', link: 'note/demo/md-demo', activeMatch: '/note/'},
    ],

    sidebar: getSideBar(),


    socialLinks: [
      {icon: 'github', link: 'https://github.com/wyl-x'}
    ]
  }
})


