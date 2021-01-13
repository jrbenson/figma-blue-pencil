import run from './revise'
import { setOpts, getOpts, resetOpts } from './options'

if (figma.command === 'revise') {
  run( true )
} else {
  figma.showUI(__html__)
  getOpts().then(function (opts) {
    figma.ui.postMessage({ type: 'options', opts: opts })
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
    }
  }
}