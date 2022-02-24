import { Options } from '../options'

export const ARRANGEMENT_TYPES = ['FRAME', 'COMPONENT', 'COMPONENT_SET']
export const DOCUMENT_TYPES = ['FRAME']

export function getDocumentStructure(opts: Options, page: PageNode) {
  const doc: { name: string; number: Number, id: string }[] = []

  let curFrameNumber = 0

  const frames = page.findChildren((n) => n.type === 'FRAME')

  for (let frame of frames) {
    let displayFrameNumber = curFrameNumber
    if (!opts.frameNumbersReverse) {
      displayFrameNumber = frames.length - 1 - curFrameNumber
    }
    displayFrameNumber += opts.frameNumbersStart

    doc.push({ name: frame.name, number: displayFrameNumber, id:frame.id })

    curFrameNumber += 1
  }

  return doc.reverse()
}

export function getRootNode( node:BaseNode ) {
    let cur_node:BaseNode|null = node
    while( cur_node.parent !== null && cur_node.parent.type !== 'PAGE' ) {
        cur_node = cur_node.parent
    }
    return cur_node
}
