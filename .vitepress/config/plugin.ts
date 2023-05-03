import path from 'path'
import fs from 'fs'

import mdContainer from 'markdown-it-container'

export const mdPlugin = (md) => {
    md.use(mdContainer, 'demo', {
        validate(params) {
            // console.log('params', params)
            return !!params.trim().match(/^demo\s*(.*)$/)
        },

        render(tokens, idx) {
            const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
            if (tokens[idx].nesting === 1 /* means the tag is opening */) {
                const description = m && m.length > 1 ? m[1] : ''
                const sourceFileToken = tokens[idx + 2]
                // console.log('description', description)

                let source = ''
                const sourceFile = sourceFileToken.children?.[0].content ?? ''
                // console.log('sourceFile', sourceFile)

                if (sourceFileToken.type === 'inline') {
                    source = fs.readFileSync(
                        path.resolve('examples', `${sourceFile}.vue`),
                        'utf-8'
                    )
                }

                if (!source) {
                    throw new Error(`Incorrect source file: ${sourceFile}`)
                }

                return `
                    <Example 
                        source="${encodeURIComponent(source)}" 
                        path="${sourceFile}" 
                        description="${description}">`
            } else {
                return '</Example>'
            }
        },
    })


}