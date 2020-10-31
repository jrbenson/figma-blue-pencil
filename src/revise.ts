import { getOpts, Options } from './options'

export default function run(close: Boolean = false) {
  getOpts()
    .then(revise)
    .then(function () {
      if (close) {
        figma.closePlugin()
      }
    })
    .catch((reason) => console.log(reason))
}

function revise(opts: Options) {
  if (opts.reviseFrames) {
    reviseFrames(opts)
  }
}

interface FrameRow {
  indices: Array<number>
  y_min: number
  y_max: number
  height: number
}
function reviseFrames(opts: Options) {
  console.log( opts )
  for (let page of figma.root.children) {
    const frames = page.findChildren((n) => n.type === 'FRAME')

    let origin = { x: Number.MAX_VALUE, y: Number.MAX_VALUE }
    let rows: Array<FrameRow> = []

    for (let i = 0; i < frames.length; i += 1) {
      const frame = frames[i]
      origin.x = Math.min(origin.x, frame.x)
      origin.y = Math.min(origin.y, frame.y)

      let inserted = false
      for (let row of rows) {
        const overlap = Math.max(0, Math.min(row.y_max, frame.y + frame.height) - Math.max(row.y_min, frame.y))
        if (overlap > opts.frameSnap) {
          row.indices.push(i)
          row.y_min = Math.min(row.y_min, frame.y)
          row.y_max = Math.max(row.y_max, frame.y + frame.height)
          row.height = Math.max(row.height, frame.height)
          inserted = true
        }
      }
      if (!inserted) {
        rows.push({
          indices: [i],
          y_min: frame.y,
          y_max: frame.y + frame.height,
          height: frame.height,
        })
      }
    }
    rows.sort((row_a, row_b) => row_a.y_min - row_b.y_min)
    for (let row of rows) {
      row.indices.sort((frame_a, frame_b) => frames[frame_a].x - frames[frame_b].x)
    }
    let offset = { x: 0, y: 0 }
    for (let row of rows) {
      offset.x = 0
      for (let fi of row.indices) {
        frames[fi].x = origin.x + offset.x
        frames[fi].y = origin.y + offset.y
        offset.x += frames[fi].width + opts.frameHSpacing
        page.insertChild(0, frames[fi])
      }
      offset.y += row.height + opts.frameVSpacing
    }
  }
}
