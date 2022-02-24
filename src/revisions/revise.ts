import { Options } from '../options'
import reviseFramesAsync from './frames'
import reviseSubstitutionsAsync from './substitutions'
import reviseTableOfContentsAsync from './toc'

export default async function reviseAsync(opts: Options) {
  // Either use all pages or just active page.
  let pages = Array(...figma.root.children)
  if (opts.activePageOnly) {
    pages = [figma.currentPage]
  }

  // Run revisions asynchronously (while we can) and await all of them finishing
  const revisePromises: Promise<void>[] = []
  if (opts.reviseFrames) {
    // Because this changes the page order it has to be awaited
    await reviseFramesAsync(opts, pages)
  }
  revisePromises.push(reviseSubstitutionsAsync(opts, pages))
  revisePromises.push(reviseTableOfContentsAsync(opts, pages))
  await Promise.allSettled(revisePromises)

  // Clearing flow starts comes at the end to avoid reset issue
  if (opts.reviseTableOfContents) {
    for (let page of pages) {
      if (page.findOne((n) => n.type === 'FRAME' && n.name.includes(opts.tocMark))) {
        page.flowStartingPoints = []
      }
    }
  }
}
