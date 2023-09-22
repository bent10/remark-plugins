# remark-code-jsx-renderer

A [remark](https://github.com/remarkjs/remark) to render JSX code blocks using a custom renderer and components. This plugin is especially useful when you want to incorporate React JSX code directly into your Markdown documents and control how it's rendered.

## Install

You can install the `remark-code-jsx-renderer` using npm or yarn:

```bash
npm i remark-code-jsx-renderer --save-dev
# or
yarn add remark-code-jsx-renderer --dev
```

## Usage

To use this plugin, you need to incorporate it into your remark processing pipeline. Here's an example of how to do it:

Say we have the following file `example.mdx`:

````md
This is some code:

```jsx renderable prettier
<Nav>
  <Nav.Item>
    <Nav.Link href='/features'>Features</Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link href='/pricing'>Pricing</Nav.Link>
  </Nav.Item>
  <Nav.Item>
    <Nav.Link href='/about'>About</Nav.Link>
  </Nav.Item>
</Nav>
```
````

**🚨 Important:** The `renderable` attribute must be specified in code fence blocks for formatting the code.

And our module `example.js` looks as follows:

```js
import { readFileSync } from 'node:fs'
import * as runtime from 'react/jsx-runtime'
import { Nav } from 'react-bootstrap'
import { renderToStaticMarkup } from 'react-dom/server'
import { remark } from 'remark'
import remarkCodeFormat from 'remark-code-format'
import remarkCodeJsxRenderer from 'remark-code-jsx-renderer'

const content = readFileSync('example.mdx', 'utf-8')

const file = await unified()
  .use(remarkCodeJsxRenderer, {
    ...runtime,
    components: { Nav },
    renderer: renderToStaticMarkup
  })
  .use(remarkCodeFormat, { htmlWhitespaceSensitivity: 'ignore' })
  .process(content)

console.log(String(file))
```

Now, running node `example.js` yields:

````md
This is some code:

```html
<div class="nav">
  <div class="nav-item">
    <a href="/features" data-rr-ui-event-key="/features" class="nav-link">
      Features
    </a>
  </div>
  <div class="nav-item">
    <a href="pricing" data-rr-ui-event-key="pricing" class="nav-link">
      Pricing
    </a>
  </div>
  <div class="nav-item">
    <a href="about" data-rr-ui-event-key="about" class="nav-link">About</a>
  </div>
</div>
```
````

> ⚠️ This plugin offers support for inline options, specifically tailored
> to the `unwrap` option. With inline options, you have fine-grained
> control over the behavior of the `unwrap` feature.
>
> ````md
> ```jsx renderable="{unwrap: true}"
> // jsx code here
> ```
> ````

## Options

This plugin accepts several options to customize its behavior:

### `components`

An object where keys represent component names and values are React component types. These components are used for rendering JSX code blocks.

```js
import { Alert, Button } from 'react-bootstrap'

processor.use(remarkCodeJsxRenderer, {
  components: { Alert, Button }
})
```

### `Fragment`

Symbol to use for fragments. This option can be helpful if your JSX code specifically requires a particular type of Fragment.

```js
import { Fragment } from 'react/jsx-runtime'

processor.use(remarkCodeJsxRenderer, { Fragment })
```

### `jsx`

The `jsx` function to use when rendering JSX code. You can customize this function if your rendering process relies on a custom `jsx` implementation.

```js
import { jsx } from 'react/jsx-runtime'

processor.use(remarkCodeJsxRenderer, { jsx })
```

### `jsxs`

The `jsxs` function to use when rendering JSX code. Similar to `jsx`, this option allows you to customize the `jsxs` function if needed.

```js
import { jsxs } from 'react/jsx-runtime'

processor.use(remarkCodeJsxRenderer, { jsxs })
```

### `renderer`

A custom rendering function for rendering JSX code. This function should return a string. You can use this to render JSX using various methods, such as converting it to HTML or rendering it on the client-side.

```js
import { renderToStaticMarkup } from 'react-dom/server'

processor.use(remarkCodeJsxRenderer, { renderer: renderToStaticMarkup })
```

### `sanitizer`

The `sanitizer` option is an optional function that allows you to sanitize the JSX code before rendering. You can use this function to enhance security and prevent code injection.

```js
import { renderToStaticMarkup } from 'react-dom/server'
import xss from 'xss'

processor.use(remarkCodeJsxRenderer, { sanitizer: customSanitizer })

// Sanitize the JSX code using the xss library
// you can replace it with any sanitizer you want (e.g. DOMPurify)
function sanitizeJSX(jsxCode) {
  const options = {
    // Define your custom xss options here
  }

  return xss(jsxCode, options)
}
```

### `unwrap`

If `true`, the plugin will not wrap the rendered code in a `codefence` element.

## Related

- [remark-code-format](https://github.com/bent10/remark-plugins/tree/main/packages/code-format)
- [remark-code-preview](https://github.com/bent10/remark-plugins/tree/main/packages/code-preview)

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
