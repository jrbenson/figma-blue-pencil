export interface Options {
  revisePageNumbers: boolean,
  pageNumbersStart: number,
  pageNumbersReverse: boolean,
  pageNumbersMark: string,
  revisePageTitles: boolean,
  pageTitlesMark: string,
  reviseDocumentTitles: boolean,
  documentTitlesMark: string,
  reviseUpdateDate: boolean,
  updateDateMark: string,
  updateDatePrefix: string,
  reviseFrames: boolean,
  frameHSpacing: number,
  frameVSpacing: number,
  frameSnap: number,
  reviseTableOfContents: boolean,
  tocMark: string,
  tocTitleMark: string,
  tocNumberMark: string,
  tocTitleDelimiter: string,
  searchDepth: number,
  ignoreSymbolsPage: boolean,
  pageIgnorePrefix: string,
  frameIgnorePrefix: string
}

const OPTS_KEY = 'blue-pencil-settings'
const OPTS_DEF: Options = {
  revisePageNumbers: true,
  pageNumbersStart: 1,
  pageNumbersReverse: true,
  pageNumbersMark: "{page}",
  revisePageTitles: true,
  pageTitlesMark: "{pagetitle}",
  reviseDocumentTitles: true,
  documentTitlesMark: "{doctitle}",
  reviseUpdateDate: true,
  updateDateMark: "{updatedate}",
  updateDatePrefix: "Updated ",
  reviseFrames: true,
  frameHSpacing: 50,
  frameVSpacing: 100,
  frameSnap: 0,
  reviseTableOfContents: true,
  tocMark: "{toc}",
  tocTitleMark: "{toc-pagetitle}",
  tocNumberMark: "{toc-pagenumber}",
  tocTitleDelimiter: "-",
  searchDepth: 1,
  ignoreSymbolsPage: true,
  pageIgnorePrefix: '_',
  frameIgnorePrefix: '_'
}

export async function getOpts(): Promise<Options> {
  try {
    const optsJSON = await Promise.resolve(OPTS_KEY).then(figma.clientStorage.getAsync)
    const opts = JSON.parse(optsJSON)
    return opts
  } catch (error) {
    return OPTS_DEF
  }
}

export async function setOpts(opts: any) : Promise<Options> {
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
  setOpts( OPTS_DEF ).then(function (opts) {
    figma.ui.postMessage({ type: 'options', opts: opts })
  })
}
