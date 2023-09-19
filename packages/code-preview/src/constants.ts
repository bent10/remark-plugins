import type { TestFunction } from './types.js'

/**
 * The default code preview template.
 */
export const DEFAULT_TEMPLATE = `
<figure class='preview'>
  <figcaption>{title}</figcaption>
  <div class='preview-showcase'>
    {preview}
  </div>
  <div class='preview-code'>
    {code}
  </div>
</figure>
`

export const DEFAULT_TEST: TestFunction = ({ lang = '' }) => {
  return (
    ['react', 'jsx', 'vue', 'vue.js', 'vue-template', 'svelte'].indexOf(
      lang as string
    ) !== -1
  )
}
