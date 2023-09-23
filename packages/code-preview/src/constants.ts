import type { TestFunction } from './types.js'

/**
 * The default code preview template.
 */
export const DEFAULT_TEMPLATE = `
<figure className='preview'>
  <figcaption>{title}</figcaption>
  <div className='preview-showcase'>
    {preview}
  </div>
  <div className='preview-code'>
    {code}
  </div>
</figure>
`

export const DEFAULT_TEST: TestFunction = ({ lang = '' }) => {
  return (
    ['html', 'react', 'jsx', 'vue', 'vue.js', 'vue-template', 'svelte'].indexOf(
      lang as string
    ) !== -1
  )
}
