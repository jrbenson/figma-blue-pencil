export interface Options {
  reviseFrameNumbers: boolean
  frameNumbersStart: number
  frameNumbersReverse: boolean
  frameNumbersMark: string
  reviseFrameNames: boolean
  frameNamesMark: string
  revisePageNames: boolean
  pageNamesMark: string
  reviseFileNames: boolean
  fileNamesMark: string
  reviseUpdateDate: boolean
  updateDateMark: string
  updateDatePrefix: string
  reviseFrames: boolean
  frameHSpacing: number
  frameVSpacing: number
  frameSnap: number
  reviseTableOfContents: boolean
  tocMark: string
  tocTitleMark: string
  tocNumberMark: string
  tocTitleDelimiter: string
  tocIncludeSelf: boolean
  tocIncludePrevious: boolean
  tocIncludeLinks: boolean
  searchDepth: number
  omitIndexPrefix: string
  omitFullPrefix: string
  activePageOnly: boolean
  collapsed: boolean
}

const OPTS_KEY = 'blue-pencil-settings'
const OPTS_DEFAULT: Options = {
  reviseFrameNumbers: true,
  frameNumbersStart: 1,
  frameNumbersReverse: false,
  frameNumbersMark: '{framenumber}',
  reviseFrameNames: true,
  frameNamesMark: '{framename}',
  revisePageNames: true,
  pageNamesMark: '{pagename}',
  reviseFileNames: true,
  fileNamesMark: '{filename}',
  reviseUpdateDate: true,
  updateDateMark: '{updatedate}',
  updateDatePrefix: 'Updated ',
  reviseFrames: true,
  frameHSpacing: 50,
  frameVSpacing: 100,
  frameSnap: 0,
  reviseTableOfContents: true,
  tocMark: '{toc}',
  tocTitleMark: '{toc-framename}',
  tocNumberMark: '{toc-framenumber}',
  tocTitleDelimiter: '-',
  tocIncludeSelf: false,
  tocIncludePrevious: true,
  tocIncludeLinks: true,
  searchDepth: 1,
  omitIndexPrefix: '_',
  omitFullPrefix: '~',
  activePageOnly: true,
  collapsed: false,
}

export async function getOpts(): Promise<Options> {
  try {
    const optsJSON = await Promise.resolve(OPTS_KEY).then(figma.clientStorage.getAsync)
    const opts = JSON.parse(optsJSON)
    return opts
  } catch (error) {
    return OPTS_DEFAULT
  }
}

export async function setOpts(opts: any): Promise<Options> {
  try {
    const optsCurrent = await getOpts()
    const optsCombined = { ...optsCurrent, ...opts }
    const optsJSON = JSON.stringify(optsCombined)
    await figma.clientStorage.setAsync(OPTS_KEY, optsJSON)
    return optsCombined
  } catch (err) {
    return opts
  }
}

export function resetOpts() {
  setOpts(OPTS_DEFAULT).then(function (opts) {
    figma.ui.postMessage({ type: 'options', opts: opts })
  })
}
