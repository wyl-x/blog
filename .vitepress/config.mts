import {defineConfig} from 'vitepress'
import {mdPlugin} from './config/plugin'
import path from 'path'

console.log('defineConfig', 123)
// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "QWER",
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
            {text: 'Components', link: 'components/timeline', activeMatch: '/components/'},
            {text: 'Demo', link: '/demo/md-demo', activeMatch: '/demo/'},
        ],

        sidebar: {
            '/components/': [
                {
                    text: '组件',
                    base: '/components',
                    items: [
                        {text: '时间线', link: '/timeline'},
                        {text: '滚屏组件', link: '/move-view'},
                    ]
                },
            ],
            '/demo/': {
                base: '/demo/',
                items: [
                    {text: 'syntax', link: '/md-demo'}
                ]
            }
        },


        socialLinks: [
            {icon: 'github', link: 'https://github.com/vuejs/vitepress'}
        ]
    }
})


