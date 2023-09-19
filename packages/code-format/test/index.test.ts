/// <reference types="vitest/globals" />

import { remark } from 'remark'
import remarkCodeFormat from '../src/index.js'

it('should format code blocks using Prettier with default options', async () => {
  const md =
    '\n```js prettier\nfoo(reallyLongArg(), omgSoManyParameters(), IShouldRefactorThis(), isThereSeriouslyAnotherOne());\n```'

  const file = await remark().use(remarkCodeFormat).process(md)

  expect(String(file)).toMatchSnapshot()
})

it('should format code blocks using Prettier with specified parser', async () => {
  const md =
    '\n```ts prettier="{ parser: \'typescript\' }"\n@observer class OrderLine {\n  @observable price: number = 0;\n}\n```'

  const file = await remark().use(remarkCodeFormat).process(md)

  expect(String(file)).toMatchSnapshot()
})

it('should handle unsupported code block languages', async () => {
  const md =
    '\n```unsupported-language prettier\nconst user: { [key: string]: string \n| number | boolean } = {\n name: "John Doe", age: 30 };\n```'

  const file = await remark().use(remarkCodeFormat).process(md)

  expect(String(file)).toMatchSnapshot()
})

it('should handle extended language mappings', async () => {
  const md = '```java prettier\npublic class HelloWorld {}\n```'

  const file = await remark().use(remarkCodeFormat).process(md)

  expect(String(file)).toMatchSnapshot()
})

it('should handle formatting failures and preserve the original code block', async () => {
  // invalid TypeScript code to trigger a formatting failure
  const md = '```ts prettier\nconst x number = 1 // missing :\n```'

  const file = await remark().use(remarkCodeFormat).process(md)

  expect(String(file)).toMatchSnapshot()
})
