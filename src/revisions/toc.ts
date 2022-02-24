import { Options } from '../options'
import { getDocumentStructure, getRootNode } from './utils'

function getContents(opts: Options, page: PageNode) {
  let main_frames = getDocumentStructure(opts, page)
  let hidden_frames = []
  let i = 1
  while (i < main_frames.length) {
    const f = main_frames[i]
    const f_prev = main_frames[i - 1]
    const f_basename = f.name.split(opts.tocTitleDelimiter)[0].trim()
    const f_prev_basename = f_prev.name.split(opts.tocTitleDelimiter)[0].trim()
    if (f_basename === f_prev_basename) {
      main_frames.splice(i, 1)
      hidden_frames.push(f)
    } else i += 1
  }
  return { main: main_frames, hidden: hidden_frames }
}

export default async function reviseTableOfContentsAsync(opts: Options, pages: PageNode[]) {
  // Store array of all async promises to await at end.
  const promises: Promise<void>[] = []

  // Iterate through the provided page nodes.
  for (let page of pages) {
    const contents_full = getContents(opts, page)

    // Iterate through all toc frames.
    for (let frame of page.findAll((n) => n.type === 'FRAME' && n.name.includes(opts.tocMark))) {
      frame = frame as FrameNode
      const root_frame = getRootNode(frame)

      // Customize contents for this frame.
      const contents: {
        main: { name: string; number: Number; id: string|null }[]
        hidden: { name: string; number: Number; id: string|null }[]
      } = JSON.parse(JSON.stringify(contents_full))
      if (!opts.tocIncludeSelf) {
        let i = 0
        while (i < contents.main.length) {
          const e = contents.main[i]
          if (e.id === root_frame.id) {
            contents.main.splice(i, 1)
            contents.hidden.push(e)
          } else i += 1
        }
      }
      if (contents.main.length <= 0) {
        contents.main.push({name:'???',number:0,id:null})
      }

      console.log(root_frame.name, contents, contents_full)

      const orig_entry = frame.findChild((n) => n.type === 'FRAME') as FrameNode
      if (orig_entry) {
        const entries: FrameNode[] = []
        for (let i = 0; i < contents.main.length; i += 1) {
          const entry = orig_entry.clone()
          entries.push(entry)
          const name = entry.findChild((n) => n.type === 'TEXT' && n.name.includes(opts.tocTitleMark)) as TextNode
          const number = entry.findChild((n) => n.type === 'TEXT' && n.name.includes(opts.tocNumberMark)) as TextNode
          if (name && !name.hasMissingFont) {
            name.autoRename = false
            promises.push(
              figma.loadFontAsync(name.getRangeFontName(0, 1) as FontName).then(() => {
                name.characters = contents.main[i].name
              })
            )
          }
          if (number && !number.hasMissingFont) {
            number.autoRename = false
            promises.push(
              figma.loadFontAsync(number.getRangeFontName(0, 1) as FontName).then(() => {
                number.characters = '' + contents.main[i].number
              })
            )
          }
        }
        for (let child of frame.children) {
          child.remove()
        }
        for (let entry of entries) {
          frame.appendChild(entry)
        }
        for (let i = 0; i < contents.main.length; i += 1) {
          const entry = entries[i]
          if (contents.main[i].id && root_frame.id !== contents.main[i].id) {
            entry.reactions = [
              {
                action: {
                  type: 'NODE',
                  destinationId: contents.main[i].id,
                  navigation: 'NAVIGATE',
                  transition: null,
                  preserveScrollPosition: false,
                },
                trigger: {
                  type: 'ON_CLICK',
                },
              },
            ]
          } else {
            entry.reactions = []
          }
        }

        // const hidden_holder = figma.createFrame()
        // frame.appendChild(hidden_holder)
        // for (let i = 0; i < contents.hidden.length; i += 1) {
        //   const rect = figma.createRectangle()
        //   hidden_holder.appendChild(rect)
        //   hidden_holder.layoutMode = 'HORIZONTAL'
        //   hidden_holder.counterAxisSizingMode = 'AUTO'
        //   hidden_holder.name = '____DO_NOT_DELETE____'
        //   rect.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }]
        //   rect.resize(0.1, 0.1)
        //   if (root_frame.id !== contents.hidden[i].id) {
        //     rect.reactions = [
        //       {
        //         action: {
        //           type: 'NODE',
        //           destinationId: contents.hidden[i].id,
        //           navigation: 'NAVIGATE',
        //           transition: null,
        //           preserveScrollPosition: false,
        //         },
        //         trigger: {
        //           type: 'ON_CLICK',
        //         },
        //       },
        //     ]
        //   }
        //   hidden_holder.rescale(0.01)
        // }
      }
    }
    page.flowStartingPoints = []
  }

  await Promise.allSettled(promises)
}
