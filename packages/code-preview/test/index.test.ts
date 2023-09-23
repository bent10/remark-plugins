/// <reference types="vitest/globals" />

import { compile } from '@mdx-js/mdx'
import { remark } from 'remark'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import remarkCodePreview from '../src/index.js'

it('should transform code blocks into code previews', async () => {
  const file = await remark()
    .use(remarkCodePreview)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify, { allowDangerousHtml: true }).process(`# Example

\`\`\`html title="Code title"
<div class='foo'>Hello, World!</div>
\`\`\`
`)

  expect(String(file)).toMatchSnapshot()
})

it('should support mdx compiler', async () => {
  const mdx = `import { Foo } from 'foo'

# Example

\`\`\`jsx title="Code title"
<Foo />
\`\`\`
`

  const file = await compile(mdx, {
    remarkPlugins: [[remarkCodePreview, { mdxJsx: true }]]
  })

  expect(String(file)).toMatchSnapshot()
})

it('should use a custom template when provided in options', async () => {
  const template = `
<figure class='foo'>
<figcaption>{title}</figcaption>
<div class='foo-preview'>
{preview}
</div>
<div class='foo-code'>
{code}
</div>
</figure>
`

  const file = await remark().use(remarkCodePreview, {
    template,
    ignoreMissing: true
  }).process(`\`\`\`html
<div class='foo'>Hello, World!</div>
\`\`\``)

  expect(String(file)).toMatchSnapshot()
})

it('should not transform code blocks that do not match the test function', async () => {
  const inputMarkdown = `
\`\`\`python
# This is a Python code block
print('Hello, World!')
\`\`\`
    `

  const file = await remark().use(remarkCodePreview).process(inputMarkdown)

  expect(String(file)).toMatchSnapshot()
})
