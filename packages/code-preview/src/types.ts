import type { Code, Parent } from 'mdast'

/**
 * Options for configuring the remarkCodePreview plugin.
 */
export interface Options {
  /**
   * A function to test nodes for code block transformation eligibility.
   */
  test?: TestFunction

  /**
   * The code preview template to use.
   */
  template?: string

  /**
   * Data to interpolate into template.
   */
  data?: { [key: string]: unknown }

  /**
   * By default, It throws a `MissingValueError` when a placeholder
   * resolves to `undefined`. With this option set to `true`, it simply ignores
   * it and leaves the placeholder as is.
   */
  ignoreMissing?: boolean

  /**
   * Whether to support [MDX compiler](https://mdxjs.com/).
   */
  mdxJsx?: boolean

  /**
   * Performs arbitrary operation for each interpolation. If the returned value
   * was `undefined`, it behaves differently depending on the
   * `ignoreMissing` option. Otherwise, the returned value will be
   * interpolated into a string (and escaped when double-braced) and
   * embedded into the template.
   *
   * @default ({value}) => value
   */
  transform?: (data: { value: unknown; key: string }) => unknown
}

/**
 * Check if a code node passes a test.
 */
export type TestFunction = (
  node: Code,
  index?: number,
  parent?: Parent
) => boolean | void
