import { saveOptions, loadOptions, setupDependencies } from './options'
import { selectMenu, disclosure } from 'figma-plugin-ds'
//https://github.com/thomas-lowry/figma-plugin-ds

selectMenu.init()
disclosure.init()

const reviseButton = document.getElementById('revise')
if (reviseButton) {
  reviseButton.onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'revise' } }, '*')
  }
}

const resetButton = document.getElementById('reset')
if (resetButton) {
  resetButton.onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'reset' } }, '*')
  }
}

onmessage = (event) => {
  const msg = event.data.pluginMessage
  switch (msg.type) {
    case 'options':
      loadOptions(msg.opts)
      break
    default:
      break
  }
}


for (let optElem of document.querySelectorAll('[data-opt]')) {
  switch (optElem.tagName) {
    case 'INPUT':
    case 'TEXTAREA':
    case 'SELECT':
      ;(optElem as HTMLInputElement).onchange = saveOptions
      break
    default:
      break
  }
}

setupDependencies()
