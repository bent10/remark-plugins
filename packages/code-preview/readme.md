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
# Example

```html preview title="Code title"
<div class="foo">Hello, World!</div>
```
````

And our module `example.js` looks as follows:

```js
import { readFile } from 'node:fs/promises'
import { remark } from 'remark'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import remarkCodePreview from 'remark-code-preview'
import remarkRehype from 'remark-rehype'

remark()
  .use(remarkCodePreview)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeStringify, { allowDangerousHtml: true })
  .process(await readFile('example.mdx'), (err, file) => {
    if (err) throw err
    console.log(String(file))
  })
```

Now, running `node example.js` yields:

```html
<h1>Example</h1>
<figure class="preview">
  <figcaption>Code title</figcaption>
  <div class="preview-showcase">
    <div class="foo">Hello, World!</div>
  </div>
  <div class="preview-code">
    <pre><code class="language-html">&#x3C;div class='foo'>Hello, World!&#x3C;/div>
</code></pre>
  </div>
</figure>
```

## Options

The Remark Code Preview Plugin accepts the following options:

### `template?: string`

The code preview template to use. You can customize the preview layout using placeholders like `{preview}`, `{code}`, codefence meta data (e.g. `{title}`), and your custom [data](#data--key-string-unknown-).

The default template looks like this:

```html
<figure className="preview">
  <figcaption>{title}</figcaption>
  <div className="preview-showcase">{preview}</div>
  <div className="preview-code">{code}</div>
</figure>
```

You can customize the template according to your needs. For example:

```js
import { readFile } from 'node:fs/promises'
import { remark } from 'remark'
import remarkCodePreview from 'remark-code-preview'

const customTemplate = `
<figure>
  <div className='preview-container'>
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
# Example

<figure>
<div class='preview-container'>
<div class="foo">Hello, World!</div>
</div>
<figcaption>Code title</figcaption>
</figure>
```

### `data?: { [key: string]: unknown }`

Data to interpolate into the template. You can provide additional data to be used in the template.

### `ignoreMissing?: boolean`

By default, the plugin throws a `MissingValueError` when a placeholder resolves to `undefined`. Setting this option to `true` ignores it and leaves the placeholder as is.

### `mdxJsx?: boolean`

Whether to support [MDX compiler](https://mdxjs.com/).

### `transform?: (data: { value: unknown; key: string }) => unknown`

Performs an arbitrary operation for each interpolation. You can define a custom transformation function for the interpolated values.

Default transformation:

```js
;({ value }) => value
```

## Related

- [remark-code-format](https://github.com/bent10/remark-plugins/tree/main/packages/code-format)
- [remark-code-jsx-renderer](https://github.com/bent10/remark-plugins/tree/main/packages/code-jsx-renderer)

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
