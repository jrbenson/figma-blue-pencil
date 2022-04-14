import { Options } from '../options'
import { DOCUMENT_TYPES } from './utils'
import { getDocumentStructure, getRootNode } from './utils'

export default async function reviseSubstitutionsAsync(opts: Options, pages: PageNode[]) {
  // Store array of all async promises to await at end.
  const promises: Promise<void>[] = []

  // Get current date for date updates.
  const curDate = opts.updateDatePrefix + new Date().toLocaleDateString()

  // Iterate through the provided page nodes.
  for (let page of pages) {
    const frames = getDocumentStructure(opts, page)

    // Iterate through the frames in each page.
    for (let frame of frames) {
      const frameNode = figma.getNodeById(frame.id) as FrameNode

      //Iterate through all text nodes in the frame.
      for (let text of frameNode.findAll((n) => n.type === 'TEXT')) {
        // Check for frame name revision.
        if (opts.reviseFrameNames && text.name.includes(opts.frameNamesMark) && !(text as TextNode).hasMissingFont) {
          ;(text as TextNode).autoRename = false
          promises.push(
            figma.loadFontAsync((text as TextNode).getRangeFontName(0, 1) as FontName).then(() => {
              ;(text as TextNode).characters = frame.name
            })
          )

          // Check for page name revision.
        } else if (
          opts.revisePageNames &&
          text.name.includes(opts.pageNamesMark) &&
          !(text as TextNode).hasMissingFont
        ) {
          ;(text as TextNode).autoRename = false
          promises.push(
            figma.loadFontAsync((text as TextNode).getRangeFontName(0, 1) as FontName).then(() => {
              ;(text as TextNode).characters = page.name
            })
          )

          // Check for file name revision.
        } else if (
          opts.reviseFileNames &&
          text.name.includes(opts.fileNamesMark) &&
          !(text as TextNode).hasMissingFont
        ) {
          ;(text as TextNode).autoRename = false
          promises.push(
            figma.loadFontAsync((text as TextNode).getRangeFontName(0, 1) as FontName).then(() => {
              ;(text as TextNode).characters = figma.root.name
            })
          )

          // Check for frame number revision.
        } else if (
          opts.reviseFrameNumbers &&
          text.name.includes(opts.frameNumbersMark) &&
          !(text as TextNode).hasMissingFont
        ) {
          ;(text as TextNode).autoRename = false
          promises.push(
            figma
              .loadFontAsync((text as TextNode).getRangeFontName(0, 1) as FontName)
              .then(getPageNumberFunc(text as TextNode, frame.number + ''))
          )

          // Check for update date revision.
        } else if (
          opts.reviseUpdateDate &&
          text.name.includes(opts.updateDateMark) &&
          !(text as TextNode).hasMissingFont
        ) {
          ;(text as TextNode).autoRename = false
          promises.push(
            figma.loadFontAsync((text as TextNode).getRangeFontName(0, 1) as FontName).then(() => {
              ;(text as TextNode).characters = curDate
            })
          )
        }
      }
    }
  }
  await Promise.allSettled(promises)
}

function getPageNumberFunc(text: TextNode, page: string) {
  return () => {
    text.characters = page
  }
}
