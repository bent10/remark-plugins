# remark-code-format

A [remark](https://github.com/remarkjs/remark) plugin for formatting code blocks using [Prettier](https://prettier.io/).

## Install

You can install `remark-code-format` using npm or yarn:

```bash
npm install remark-code-format --save-dev
# or
yarn add remark-code-format --dev
```

**Note:** Be sure to install the `prettier` package as well.

## Usage

Once you've installed the plugin, you can use it in your remark configuration. Here's an example of how to configure it:

```js
const remark = require('remark')
const remarkCodeFormat = require('remark-code-format')

const markdown = `
\`\`\`html prettier
<div><p>Greetings, traveler! Sign up today!</p></div>
\`\`\`
`

remark()
  .use(remarkCodeFormat, {
    /* Prettier options */
  })
  .process(markdown, (err, file) => {
    if (err) throw err
    console.log(String(file))
  })
```

**🚨 Important:** The `prettier` attribute must be specified in code fence blocks for formatting the code.

Yields:

````md
```html
<div>
  <p>Greetings, traveler! Sign up today!</p>
</div>
```
````

## Inline Options

Prettier configuration can be specified in code fence blocks using the `prettier` attribute, it has a higher priority than plugin `Options`. For example:

````md
```ts prettier="{ parser: 'typescript' }"
// your code here
```
````

## Related

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
