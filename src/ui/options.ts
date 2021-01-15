export function saveOptions() {
    let opts: any = {}
    for (let optElem of document.querySelectorAll('[data-opt]')) {
      const optKey = (optElem as HTMLElement).getAttribute('data-opt')
      if (optKey) {
        switch (optElem.tagName) {
          case 'INPUT':
            switch ((optElem as HTMLInputElement).type) {
              case 'checkbox':
                opts[optKey] = (optElem as HTMLInputElement).checked
                break
              default:
                if ((optElem as HTMLInputElement).type === 'number') {
                  opts[optKey] = Number((optElem as HTMLInputElement).value)
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

  export function loadOptions(opts: any) {
    for (let optElem of document.querySelectorAll('[data-opt]')) {
      const optKey = (optElem as HTMLElement).getAttribute('data-opt')
      if (optKey && opts.hasOwnProperty(optKey)) {
        switch (optElem.tagName) {
          case 'INPUT':
            switch ((optElem as HTMLInputElement).type) {
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

  export function setupDependencies() {
    const dependencies: Map<HTMLElement, HTMLElement[]> = new Map()
    for (let depElem of document.querySelectorAll('[data-dep]')) {
      const srcId = (depElem as HTMLElement).getAttribute('data-dep')
      if (srcId) {
        const srcElem = document.getElementById(srcId)
        if (srcElem) {
          if (!dependencies.has(srcElem)) {
            dependencies.set(srcElem, [])
          }
          dependencies.get(srcElem)?.push(depElem as HTMLElement)
        }
      }
    }
    for (let [src, deps] of dependencies) {
      src.addEventListener('change', function () {
        if (src.tagName === 'INPUT' && (src as HTMLInputElement).type === 'checkbox') {
          for (let dep of deps) {
            if ((src as HTMLInputElement).checked) {
              dep.style.removeProperty('display')
            } else {
              dep.style.display = 'none'
            }
          }
        }
      })
    }
  }
  