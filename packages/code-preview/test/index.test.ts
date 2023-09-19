/// <reference types="vitest/globals" />

import { remark } from 'remark'
import remarkCodePreview from '../src/index.js'

it('should transform code blocks into code previews', async () => {
  const file = await remark().use(remarkCodePreview)
    .process(`import { Foo } from 'foo'

# Example

\`\`\`jsx title="Code title"
<Foo />
\`\`\`
`)

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
  }).process(`\`\`\`jsx
<Foo />
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
