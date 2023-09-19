import { parseAttrs } from 'attributes-parser'
import type { Root } from 'mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toMarkdown } from 'mdast-util-to-markdown'
import pupa from 'pupa'
import { convert, type Test } from 'unist-util-is'
import { visit, SKIP, EXIT } from 'unist-util-visit'
import { DEFAULT_TEMPLATE, DEFAULT_TEST } from './constants.js'
import type { Options } from './types.js'

export type * from './types.js'

/**
 * A [remark](https://github.com/remarkjs/remark) plugin for transforming code blocks into code previews.
 *
 * @param options - The configuration options for the plugin.
 * @returns A function that transforms the MDAST tree.
 */
export default function remarkCodePreview(options: Options = {}) {
  const {
    template = DEFAULT_TEMPLATE,
    test = DEFAULT_TEST,
    data,
    ...pupaOptions
  } = options
  const assert = convert(test as Test)
  const formatedTemplate = formatTemplate(template)

  /**
   * Transform the MDAST tree by replacing code blocks with code previews.
   *
   * @param mdast - The MDAST tree to transform.
   */
  return function transform(mdast: Root) {
    visit(mdast, 'code', (node, index = 0, parent) => {
      if (!assert(node, index, parent)) return

      const code = toMarkdown(node)
      const meta = parseAttrs(node.meta || '')
      const renderedTemplate = pupa(
        formatedTemplate,
        {
          preview: node.value,
          code: `\n${code}`,
          ...data,
          ...meta
        },
        pupaOptions
      )
      const previewTree = fromMarkdown(renderedTemplate)

      // Replace the node tree with the preview tree
      const len = parent?.children?.length
      parent?.children.splice(index, 1, ...previewTree.children)

      return len && len - 1 === 0 ? [EXIT, index] : [SKIP, index + 2]
    })
  }
}

/**
 * Format the template by removing leading and trailing whitespace from
 * each line.
 *
 * @param template - The code preview template to format.
 * @returns Formatted template.
 */
function formatTemplate(template: string) {
  return template
    .split('\n')
    .map(line => line.trim())
    .join('\n')
}
