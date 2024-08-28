import type { PluginObj } from '@babel/core'

/**
 * Create a Babel plugin to remove all import declarations from code.
 */
export const removeImport: PluginObj = {
  name: 'babel-plugin-remove-import',
  visitor: {
    ImportDeclaration(path) {
      path.remove()
    }
  }
}

export const attrPattern =
  /\s*renderable(?:=(?:"[^"]*"|'[^']*'|[^"'\s]*))?$|renderable(?:=(?:"[^"]*"|'[^']*'|[^"'\s]*))?\s*/g
