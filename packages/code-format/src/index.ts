import { parseAttrs } from 'attributes-parser'
import type { Code, Root } from 'mdast'
import * as prettier from 'prettier'
import { selectAll } from 'unist-util-select'
import { EXTENDED_LANG_MAP, LANG_MAP } from './constants.js'

/**
 * A [remark](https://github.com/remarkjs/remark) plugin for formatting code blocks using Prettier.
 *
 * @returns A function that transforms the MDAST tree.
 */
export default function remarkCodeFormat(options?: prettier.Options) {
  return async (mdast: Root) => {
    const codes = selectAll('code', mdast) as Code[]
    const langMappings = { ...LANG_MAP, ...EXTENDED_LANG_MAP }
    const langs = Object.keys(langMappings)

    for (const code of codes) {
      if (!langs.includes(String(code.lang).toLowerCase())) continue

      const configFile = await prettier.resolveConfig(process.cwd())
      // ```jsx prettier="{ parser: 'babel' }"
      // ```
      const { prettier: inlineOptions } = parseAttrs(String(code.meta))

      // required `prettier` meta:
      // ```jsx prettier
      // ```
      if (inlineOptions) {
        // preserve the original code block if formatting fails
        try {
          code.value = await prettier.format(code.value, {
            parser:
              langMappings[String(code.lang) as keyof typeof langMappings],
            ...configFile,
            ...options,
            ...(isPlainObject(inlineOptions)
              ? (inlineOptions as prettier.Options)
              : {})
          })
        } catch {}
      }
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
