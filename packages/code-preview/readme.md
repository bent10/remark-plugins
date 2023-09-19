# remark-code-preview

A [remark](https://github.com/remarkjs/remark) plugin designed to transform code blocks within Markdown documents into code previews. It allows you to generate visually appealing code previews for your code snippets within your Markdown content. You can customize the appearance and behavior of code previews using [templates and options](#options).

## Install

You can install `remark-code-preview` using npm or yarn:

```bash
npm install remark-code-preview --save-dev
# or
yarn add remark-code-preview --dev
```

## Usage

To use `remark-code-preview` in your remark-based Markdown processing pipeline, you need to configure your remark processor with this plugin. Here's an example of how to do it:

Say we have the following file `example.mdx`:

````md
import { Foo } from 'foo'

# Example

```jsx title="Code title"
<Foo />
```
````

And our module `example.js` looks as follows:

```js
import { readFile } from 'node:fs/promises'
import { remark } from 'remark'
import remarkCodePreview from 'remark-code-preview'

remark()
  .use(remarkCodePreview)
  .process(await readFile('example.mdx'), (err, file) => {
    if (err) throw err
    console.log(String(file))
  })
```

Now, running `node example.js` yields:

````md
import { Foo } from 'foo'

# Example

<figure class='preview'>
<figcaption>Code title</figcaption>
<div class='preview-showcase'>
<Foo />
</div>
<div class='preview-code'>

```jsx title="Code title"
<Foo />
```

</div>
</figure>
````

## Options

The Remark Code Preview Plugin accepts the following options:

### `template?: string`

The code preview template to use. You can customize the preview layout using placeholders like `{preview}`, `{code}`, codefence meta data (e.g. `{title}`), and your custom [data](#data--key-string-unknown-).

The default template looks like this:

```markdown
<figure class='preview'>
  <figcaption>{title}</figcaption>
  <div class='preview-showcase'>
    {preview}
  </div>
  <div class='preview-code'>
    {code}
  </div>
</figure>
```

You can customize the template according to your needs. For example:

```js
import { readFile } from 'node:fs/promises'
import { remark } from 'remark'
import remarkCodePreview from 'remark-code-preview'

const customTemplate = `
<figure>
  <div class='preview-container'>
    {preview}
  </div>
  <figcaption>{title}</figcaption>
</figure>
`

remark()
  .use(remarkCodePreview, { template: customTemplate })
  .process(await readFile('example.mdx'), (err, file) => {
    if (err) throw err
    console.log(String(file))
  })
```

Yields:

```md
import { Foo } from 'foo'

# Example

<figure>
<div class='preview-container'>
<Foo />
</div>
<figcaption>Code title</figcaption>
</figure>
```

### `test?: TestFunction`

A function to test nodes for code block transformation eligibility. You can define your own logic to determine which code blocks to transform.

Default test function:

```js
({ lang = '' }) => {
  return (
    ['react', 'jsx', 'vue', 'vue.js', 'vue-template', 'svelte'].indexOf(
      lang as string
    ) !== -1
  );
}
```

```ts
type TestFunction = (
  node: Code,
  index?: number,
  parent?: Parent
) => boolean | void
```

You can define a custom test function to specify which code blocks to transform. For example, only transform code blocks with a specific language:

```js
import { unified } from 'unified'
import rehypeStringify from 'rehype-stringify'
import remarkCodePreview from 'remark-code-preview'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'

const customTest = node => node.lang === 'custom-language'

const processor = unified()
  .use(remarkParse)
  .use(remarkCodePreview, { test: customTest })
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeStringify, { allowDangerousHtml: true })
```

### `data?: { [key: string]: unknown }`

Data to interpolate into the template. You can provide additional data to be used in the template.

### `ignoreMissing?: boolean`

By default, the plugin throws a `MissingValueError` when a placeholder resolves to `undefined`. Setting this option to `true` ignores it and leaves the placeholder as is.

### `transform?: (data: { value: unknown; key: string }) => unknown`

Performs an arbitrary operation for each interpolation. You can define a custom transformation function for the interpolated values.

Default transformation:

```js
;({ value }) => value
```

## Related

- [remark-code-format](https://github.com/bent10/remark-plugins/tree/main/packages/code-format)

## Contributing

We 💛&nbsp; issues.

When committing, please conform to [the semantic-release commit standards](https://www.conventionalcommits.org/). Please install `commitizen` and the adapter globally, if you have not already.

```bash
npm i -g commitizen cz-conventional-changelog
```

Now you can use `git cz` or just `cz` instead of `git commit` when committing. You can also use `git-cz`, which is an alias for `cz`.

```bash
git add . && git cz
```

## License

![GitHub](https://img.shields.io/github/license/bent10/remark-plugins)

A project by [Stilearning](https://stilearning.com) &copy; 2023.
