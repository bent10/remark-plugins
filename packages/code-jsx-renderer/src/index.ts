import { parseAttrs } from 'attributes-parser'
import { transformSync } from '@babel/core'
import * as acorn from 'acorn'
import type { Root } from 'mdast'
import { mdxFromMarkdown, mdxToMarkdown } from 'mdast-util-mdx'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { mdxjs } from 'micromark-extension-mdxjs'
import type { Processor } from 'unified'
import { SKIP, visit } from 'unist-util-visit'
import type { Options } from './types.js'
import { attrPattern, removeImport } from './utils.js'

export type { Options }

/**
 * A [remark](https://github.com/remarkjs/remark) plugin for rendering JSX code blocks using a custom renderer and components.
 *
 * @param options - The configuration options for the plugin.
 * @returns A function that transforms the MDAST tree.
 */
export default function remarkCodeJsxRenderer(
  this: unknown,
  options: Options = {}
) {
  const {
    components = {},
    Fragment,
    jsx,
    jsxs,
    renderer,
    sanitizer,
    unwrap
  } = options

  if (!jsx || !renderer) return

  const allowedLangs = ['react', 'javascriptreact', 'jsx']
  const data = (this as Processor).data() as Record<string, unknown>

  // Enables MDX syntax
  add('micromarkExtensions', mdxjs({ acorn, addResult: true }))
  add('fromMarkdownExtensions', mdxFromMarkdown())
  add('toMarkdownExtensions', mdxToMarkdown())

  return (mdast: Root) => {
    visit(mdast, 'code', (node, index = 0, parent) => {
      // support for inline options, only for the `unwrap` option.
      // ```jsx renderable="{ unwrap: true }"
      // ```
      const { renderable } = parseAttrs(String(node.meta))

      const code = node.value
      const isRenderable =
        node.meta &&
        !!renderable &&
        allowedLangs.indexOf(String(node.lang)) !== -1

      if (!code || code === null || !isRenderable) return [SKIP, index + 1]

      try {
        const safeValue = sanitizer ? sanitizer(code) : code

        const result = transformSync(safeValue, {
          plugins: [removeImport],
          presets: [
            [
              '@babel/preset-react',
              { runtime: 'automatic', development: false }
            ]
          ]
        })

        // Create a dynamic function using new Function to render the code value's JSX.
        const Component = new Function(
          'Fragment',
          '_jsx',
          '_jsxs',
          ...Object.keys(components),
          `return ${result?.code}`
        )

        const renderedValue = renderer(
          Component(Fragment, jsx, jsxs, ...Object.values(components))
        )

        const inlineOptions = isPlainObject(renderable)
          ? (renderable as Options)
          : {}

        if (inlineOptions.unwrap || unwrap) {
          const renderedValueTree = fromMarkdown(renderedValue, {
            extensions: [mdxjs({ acorn, addResult: true })],
            mdastExtensions: [mdxFromMarkdown()]
          })

          parent?.children.splice(index, 1, ...renderedValueTree.children)
        } else {
          Object.assign(node, {
            lang: 'html',
            meta: node.meta?.replace(attrPattern, ''),
            value: renderedValue
          })
        }
      } catch {
        // preserve the original code block
      }

      return [SKIP, index + 1]
    })
  }

  /**
   * Add an item to a list in the processor's data.
   *
   * @param key - The key of the list.
   * @param value - The value to add to the list.
   */
  function add(key: string, value: unknown) {
    /* c8 ignore next 2 */
    if (Array.isArray(data[key])) {
      ;(data[key] as unknown[]).push(value)
    } else {
      data[key] = [value]
    }
  }
}

/**
 * Checks if an object is a plain JavaScript object.
 *
 * @param obj - The object to check.
 * @returns `true` if the object is a plain JavaScript object, `false`
 *   otherwise.
 */
function isPlainObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}
