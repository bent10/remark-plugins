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

export const ATTR_PATTERN =
  /\s*preview(?:=([""])?.*?\1)?$|preview(?:=([""])?.*?\1)?\s*/g
