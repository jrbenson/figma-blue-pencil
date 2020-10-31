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
function loadOptions(opts: any) {
  for (let optElem of document.querySelectorAll('[data-opt]')) {
    const optKey = (optElem as HTMLElement).getAttribute('data-opt')
    if (optKey && opts.hasOwnProperty(optKey)) {
      switch (optElem.tagName) {
        case 'INPUT':
          switch( (optElem as HTMLInputElement).type) {
            case 'checkbox':
              ;(optElem as HTMLInputElement).checked = opts[optKey]
              break
            default:
              ;(optElem as HTMLInputElement).value = opts[optKey]
              break
          }
          break
        case 'TEXTAREA':
          ;(optElem as HTMLTextAreaElement).value = opts[optKey]
          break
        case 'SELECT':
          ;(optElem as HTMLSelectElement).value = opts[optKey]
          break
        default:
          break
      }
    }
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
function saveOptions() {
  let opts: any = {}
  for (let optElem of document.querySelectorAll('[data-opt]')) {
    const optKey = (optElem as HTMLElement).getAttribute('data-opt')
    if (optKey) {
      switch (optElem.tagName) {
        case 'INPUT':
          switch( (optElem as HTMLInputElement).type) {
            case 'checkbox':
              opts[optKey] = (optElem as HTMLInputElement).checked
              break
            default:
              if ((optElem as HTMLInputElement).type === 'number') {
                opts[optKey] = Number( (optElem as HTMLInputElement).value )
              } else {
                opts[optKey] = (optElem as HTMLInputElement).value
              }
              break
          }
          break
        case 'TEXTAREA':
          opts[optKey] = (optElem as HTMLTextAreaElement).value
          break
        case 'SELECT':
          opts[optKey] = (optElem as HTMLSelectElement).options[(optElem as HTMLSelectElement).selectedIndex].value
          break
        default:
          break
      }
    }
  }
  parent.postMessage({ pluginMessage: { type: 'options', opts } }, '*')
}
