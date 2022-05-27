import { Options } from '../options'

export const ARRANGEMENT_TYPES = ['FRAME', 'COMPONENT', 'COMPONENT_SET']
export const DOCUMENT_TYPES = ['FRAME']

export function getDocumentStructure(opts: Options, page: PageNode) {
  const doc: { name: string; number: Number; id: string; hidden: boolean }[] = []

  const frames = page.findChildren((n) => n.type === 'FRAME')
  const indexed_frames = frames.filter(
    (f) =>
      (!opts.omitFullPrefix || !startsWith(f.name, opts.omitFullPrefix)) &&
      (!opts.omitIndexPrefix || !startsWith(f.name, opts.omitIndexPrefix))
  )
  const index_length = indexed_frames.length

  let curFrameNumber = 0
  for (let frame of frames) {
    console.log(frame.name, curFrameNumber)
    let name = frame.name
    let hidden = false

    if (!opts.omitFullPrefix || !startsWith(name, opts.omitFullPrefix)) {
      let displayFrameNumber = 0

      if (!opts.omitIndexPrefix || !startsWith(name, opts.omitIndexPrefix)) {
        displayFrameNumber = curFrameNumber
        if (!opts.frameNumbersReverse) {
          displayFrameNumber = index_length - 1 - curFrameNumber
        }
        displayFrameNumber += opts.frameNumbersStart
        curFrameNumber += 1
      } else {
        name = removePrefix(name, opts.omitIndexPrefix)
        hidden = true
      }

      doc.push({ name: name, number: displayFrameNumber, id: frame.id, hidden: hidden })
    }
  }

  return doc.reverse()
}

export function getRootNode(node: BaseNode) {
  let cur_node: BaseNode | null = node
  while (cur_node.parent !== null && cur_node.parent.type !== 'PAGE') {
    cur_node = cur_node.parent
  }
  return cur_node
}

export function startsWith(str: string, prefix: string) {
  return str.trim().substring(0, prefix.length) === prefix
}

export function removePrefix(str: string, prefix: string) {
  return str.trim().substring(prefix.length)
}
