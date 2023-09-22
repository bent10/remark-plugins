/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vitest/globals" />

import { remark } from 'remark'
import * as runtime from 'react/jsx-runtime'
import { renderToStaticMarkup } from 'react-dom/server'
import remarkCodeJsxRenderer from '../src/index.js'

it('should render JSX code block with custom renderer', async () => {
  const content = '```jsx renderable\n<div>Hello, World!</div>;\n```\n'

  const processor = remark().use(remarkCodeJsxRenderer, {
    ...runtime,
    renderer: renderToStaticMarkup
  })
  const file = await processor.process(content)

  expect(String(file)).toMatchSnapshot()
})

it('should handle sanitizer function', async () => {
  const content =
    '```javascriptreact renderable\n<script>alert("Hello!");</script>;\n```\n'

  const file = await remark()
    .use(remarkCodeJsxRenderer, {
      ...runtime,
      renderer: renderToStaticMarkup,
      sanitizer(code: string) {
        /// match <script> tags
        const scriptTagRegex =
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi

        return code.replace(scriptTagRegex, match => {
          // return the sanitized code as a jsx element
          return `<div key='0' dangerouslySetInnerHTML={{ __html: '&lt;${match.slice(
            1
          )}' }} />`
        })
      }
    })
    .process(content)

  expect(String(file)).toMatchSnapshot()
})

it('should unwrap the code block when "unwrap" option is true', async () => {
  const content = '```react renderable\n<div>Hello, World!</div>\n```\n'

  const file = await remark()
    .use(remarkCodeJsxRenderer, {
      ...runtime,
      renderer: renderToStaticMarkup,
      unwrap: true
    })
    .process(content)

  expect(String(file)).toMatchSnapshot()
})

it('should handle inline `unwrap` option', async () => {
  const content =
    '```react renderable="{unwrap: true, jsx: \'ignored\'}"\n<Foo>Hello, World!</Foo>\n```\n'

  const file = await remark()
    .use(remarkCodeJsxRenderer, {
      ...runtime,
      components: {
        Foo: ({ children }: { children?: string }) =>
          (runtime as any).jsx('div', { children })
      },
      renderer: renderToStaticMarkup
    })
    .process(content)

  expect(String(file)).toMatchSnapshot()
})

it('should not modify unsupported code block languages', async () => {
  const content = '```unsupported-language renderable\nconst x = 1\n```\n'

  const file = await remark()
    .use(remarkCodeJsxRenderer, {
      ...runtime,
      renderer: renderToStaticMarkup,
      unwrap: true
    })
    .process(content)

  expect(String(file)).toBe(content)
})

it('should handle formatting failures and preserve the original code block', async () => {
  // Invalid JSX code to trigger a formatting failure
  const content = '```jsx renderable\n<div>Missing closing tag\n```\n'

  const file = await remark()
    .use(remarkCodeJsxRenderer, {
      ...runtime,
      renderer: renderToStaticMarkup,
      unwrap: true
    })
    .process(content)

  // Expect the code block to remain unchanged due to the formatting failure
  expect(String(file)).toEqual(content)
})

it('should not render JSX code block without `renderable` attribute', async () => {
  const content = '```jsx\n<div>Hello, World!</div>;\n```\n'

  const processor = remark().use(remarkCodeJsxRenderer, {
    ...runtime,
    renderer: renderToStaticMarkup
  })
  const file = await processor.process(content)

  expect(String(file)).toBe(content)
})

it('should not render JSX code block without `jsx` runner', async () => {
  const content = '```jsx\n<div>Hello, World!</div>;\n```\n'

  const processor = remark().use(remarkCodeJsxRenderer, {
    renderer: renderToStaticMarkup
  })
  const file = await processor.process(content)

  expect(String(file)).toBe(content)
})

it('should not render JSX code block without `renderer`', async () => {
  const content = '```jsx\n<div>Hello, World!</div>;\n```\n'

  const processor = remark().use(remarkCodeJsxRenderer, {
    ...runtime
  })
  const file = await processor.process(content)

  expect(String(file)).toBe(content)
})
