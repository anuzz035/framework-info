import { promises as fs } from 'fs'

import { FRAMEWORK_NAMES } from '../src/frameworks/main.js'

const FRAMEWORKS_DIR = new URL('../src/frameworks/', import.meta.url)
const BUILD_DIR = new URL('../build/', import.meta.url)
const FRAMEWORKS_BUILD = new URL('frameworks.js', BUILD_DIR)

// We enforce frameworks to be written with JSON to ensure they remain logicless
// which is simpler for contributors and avoid adding unnecessary logic.
// However, Node.js does not support JSON imports without any experimental
// flags. Also, not all browsers support it unless Webpack preprocesses it.
// Therefore, we transform JSON to JavaScript files using at build time.
const transformFrameworks = async function () {
  await fs.mkdir(BUILD_DIR, { recursive: true })
  const frameworks = await Promise.all(FRAMEWORK_NAMES.map(transformFramework))
  const fileContents = `${FRAMEWORKS_HEADER}${JSON.stringify(frameworks, null, 2)}`
  await fs.writeFile(FRAMEWORKS_BUILD, fileContents)
}

const transformFramework = async function (frameworkName) {
  const frameworkUrl = new URL(`${frameworkName}.json`, FRAMEWORKS_DIR)
  const jsonContents = await fs.readFile(frameworkUrl)
  const contents = JSON.parse(jsonContents)
  return contents
}

const FRAMEWORKS_HEADER = `// This file is autogenerated at build time
export const FRAMEWORKS = `

transformFrameworks()
