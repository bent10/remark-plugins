import type { Root } from 'mdast'
import type { Processor } from 'unified'
import { visit } from 'unist-util-visit'

export default function remarkCodeEvalJsx(this: Processor) {
  return async (mdast: Root) => {
    visit(mdast, 'code', (node, index = 0, parent) => {
      mdast
      const data = this.data() as Record<string, unknown>

      // Add MDX extensions
      // add('micromarkExtensions', mdxjs({ acorn, addResult: true }))
      // add('fromMarkdownExtensions', mdxFromMarkdown())
      // add('toMarkdownExtensions', mdxToMarkdown())
      /**
       * Add an item to a list in the processor's data.
       *
       * @param key - The key of the list.
       * @param value - The value to add to the list.
       */
      function add(key: string, value: unknown) {
        const list: unknown[] = (data[key] as unknown[]) || (data[key] = [])
        list.push(value)
      }
    })
  }
}
