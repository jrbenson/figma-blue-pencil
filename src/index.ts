import reviseAsync from './revisions/revise'
import { setOpts, getOpts, resetOpts, Options } from './options'

if (figma.command === 'revise') {
  run(true)
} else {
  figma.showUI(__html__, { width: 240, height: 640 })
  getOpts().then(function (opts) {
    figma.ui.postMessage({ type: 'options', opts: opts })
    setCollapsed(opts.collapsed)
  })
  figma.ui.onmessage = (msg) => {
    switch (msg.type) {
      case 'revise':
        run()
        break
      case 'options':
        setOpts(msg.opts)
        break
      case 'reset':
        resetOpts()
        break
      case 'collapse':
        collapse()
        break
    }
  }
}

async function run(close: Boolean = false) {
  getOpts()
    .then(reviseAsync)
    .then(function () {
      if (close) {
        figma.closePlugin()
      } else {
        figma.ui.postMessage({ type: 'complete' })
      }
    })
    .catch((reason) => console.log(reason))
}

function setCollapsed(collapsed: boolean) {
  if (collapsed) {
    figma.ui.resize(240, 120)
  } else {
    figma.ui.resize(240, 640)
  }
  figma.ui.postMessage({ type: 'collapse', state: collapsed })
}
function collapseToggle(opts: Options) {
  opts.collapsed = !opts.collapsed
  setOpts(opts)
  setCollapsed(opts.collapsed)
}
function collapse() {
  getOpts().then(collapseToggle)
}
