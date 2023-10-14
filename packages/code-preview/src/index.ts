import parseAttrs from 'attributes-parser'
import type { Root } from 'mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { mdxFromMarkdown } from 'mdast-util-mdx'
import { toMarkdown } from 'mdast-util-to-markdown'
import { mdxjs } from 'micromark-extension-mdxjs'
import pupa from 'pupa'
import { visit, SKIP, EXIT } from 'unist-util-visit'
import { ATTR_PATTERN, DEFAULT_TEMPLATE } from './constants.js'
import type { Options } from './types.js'

export type * from './types.js'

/**
 * A [remark](https://github.com/remarkjs/remark) plugin for transforming code blocks into code previews.
 *
 * @param options - The configuration options for the plugin.
 * @returns A function that transforms the MDAST tree.
 */
export default function remarkCodePreview(
  this: unknown,
  options: Options = {}
) {
  const { template = DEFAULT_TEMPLATE, data, mdxJsx, ...pupaOptions } = options
  const formatedTemplate = formatTemplate(template)

  /**
   * Transform the MDAST tree by replacing code blocks with code previews.
   *
   * @param mdast - The MDAST tree to transform.
   */
  return (mdast: Root) => {
    visit(mdast, 'code', (node, index = 0, parent) => {
      const { preview, ...meta } = parseAttrs(node.meta || '')

      if (!preview) return

      node.meta = node.meta?.replace(ATTR_PATTERN, '')

      const code = toMarkdown(node)
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

      const previewTree = fromMarkdown(renderedTemplate, {
        extensions: mdxJsx ? [mdxjs()] : null,
        mdastExtensions: mdxJsx ? [mdxFromMarkdown()] : null
      })

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
