import { extensions } from 'vscode'

/**
 * Lifted off lit-html
 */
export default async function () {

  const extension = extensions.getExtension('vscode.typescript-language-features')

  if (!extension) {

    return

  }

  await extension.activate()

  if (!extension.exports || !extension.exports.getAPI) {

    return

  }

  const api = extension.exports.getAPI(0)

  if (!api) {

    return

  }

  api.configurePlugin('typescript-lit-html-plugin', {
    tags: [
      'liquid'
    ],
    format: {
      enabled: false
    }
  })

}
