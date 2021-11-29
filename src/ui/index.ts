import { saveOptions, loadOptions } from './options'
import { selectMenu, disclosure } from 'figma-plugin-ds'
//https://github.com/thomas-lowry/figma-plugin-ds

selectMenu.init()
disclosure.init()

setTimeout(() => document.querySelector('.ld-over')?.classList.remove('running'), 1000)

const reviseButton = document.getElementById('revise') as HTMLButtonElement
if (reviseButton) {
  reviseButton.onclick = () => {
    document.querySelector('.ld-over')?.classList.add('running')
    reviseButton.disabled = true
    if (collapseButton) {
      collapseButton.style.opacity = '0.3'
    }
    setTimeout(() => parent.postMessage({ pluginMessage: { type: 'revise' } }, '*'), 30)
  }
}

const resetButton = document.getElementById('reset') as HTMLButtonElement
if (resetButton) {
  resetButton.onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'reset' } }, '*')
  }
}

const collapseButton = document.getElementById('collapse')
if (collapseButton) {
  collapseButton.onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'collapse' } }, '*')
  }
}
const collapseButtonIcon = document.getElementById('collapse_icon')
function setCollapse(collapsed: boolean) {
  collapseButtonIcon?.classList.remove(...collapseButtonIcon?.classList)
  collapseButtonIcon?.classList.add('icon')
  if (collapsed) {
    collapseButtonIcon?.classList.add('icon--caret-down')
  } else {
    collapseButtonIcon?.classList.add('icon--caret-up')
  }
}

onmessage = (event) => {
  const msg = event.data.pluginMessage
  switch (msg.type) {
    case 'options':
      loadOptions(msg.opts)
      break
    case 'collapse':
      setCollapse(msg.state)
      break
    case 'complete':
      document.querySelector('.ld-over')?.classList.remove('running')
      reviseButton.disabled = false
      if (collapseButton) {
        collapseButton.style.opacity = '1.0'
      }
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
