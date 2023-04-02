import {defineConfig} from 'vitepress'
import {mdPlugin} from './config/plugin'
import path from 'path'

console.log('defineConfig', 123)
// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "组件库",
    description: "A VitePress Site",
    srcDir: 'src',
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
            {text: '组件', link: 'components/timeline', activeMatch: '/components/'},
            {text: '笔记', link: 'demo/md-demo', activeMatch: '/demo/'},
        ],

        sidebar: {
            '/components': [
                {
                    text: '数据展示',
                    base: '/components',
                    items: [
                        {text: '时间线', link: '/timeline'},
                        {text: '滚屏', link: '/move-view'},
                    ]
                },
            ],
            '/demo': [
                {
                    text: 'Demo',
                    base: '/demo',
                    items: [
                        {text: 'markdown高亮', link: '/md-demo'},
                    ]
                }
            ]
        },


        socialLinks: [
            {icon: 'github', link: 'https://github.com/wyl-x'}
        ]
    }
})


