# remark-plugins

[Remark](https://github.com/remarkjs/remark) plugins workspace.

## Install

Follows the steps below to get up and running:

```bash
# clone this repo
> git clone https://github.com/bent10/remark-plugins.git

# go to the project directory and install dependencies
> cd remark-plugins && npm i
```

## Packages

| Package                                                | Description                                                   | Version (click for changelog)                                                                            |
| :----------------------------------------------------- | :------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------- |
| [remark-code-format](packages/code-format)             | Formatting code blocks using Prettier                         | [![npm](https://img.shields.io/npm/v/remark-code-format)](packages/code-format/changelog.md)             |
| [remark-code-jsx-renderer](packages/code-jsx-renderer) | Render JSX code blocks using a custom renderer and components | [![npm](https://img.shields.io/npm/v/remark-code-jsx-renderer)](packages/code-jsx-renderer/changelog.md) |
| [remark-code-preview](packages/code-preview)           | Transform code blocks into code previews                      | [![npm](https://img.shields.io/npm/v/remark-code-preview)](packages/code-preview/changelog.md)           |

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
