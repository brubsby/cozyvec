 'use strict'

function Client() {
  this.el = document.createElement('div')
  this.el.id = 'cozyvec'

  this.acels = new Acels(this)
  this.codearea = new CodeArea(this)
  this.plotarea = new PlotArea(this)
  this.source = new Source(this)
  this.api = new Api(this)
  this.papersizes = new PaperSizes()

  this.bindings = {}

  this.install = function(host = document.body) {
    this._wrapper = document.createElement('div')
    this._wrapper.id = 'wrapper'

    this.codearea.install(this._wrapper)
    this.plotarea.install(this._wrapper)
    this.el.appendChild(this._wrapper)
    host.appendChild(this.el)

    this.acels.set('File', 'New', 'CmdOrCtrl+N', () => { this.source.new(); this.plotarea.reset(); this.codearea.clear() })
    this.acels.set('File', 'Save', 'CmdOrCtrl+S', () => { this.source.write('cozyvec', 'cv', this.codearea._input.value, 'text/plain') })
    this.acels.set('File', 'Export SVG', 'CmdOrCtrl+E', () => { this.source.write('cozyvec', 'svg', this.plotarea.getSvg(), 'image/svg+xml') })
    this.acels.set('File', 'Export PNG', 'CmdOrCtrl+P', () => { this.source.write('cozyvec', 'png', this.plotarea.el.toDataURL('image/png', 1.0), 'image/png') })
    this.acels.set('File', 'Open', 'CmdOrCtrl+O', () => { this.source.open('cv', this.whenOpen) })

    this.acels.add('Edit', 'undo')
    this.acels.add('Edit', 'redo')
    this.acels.add('Edit', 'cut')
    this.acels.add('Edit', 'copy')
    this.acels.add('Edit', 'paste')
    this.acels.add('Edit', 'selectAll')

    this.acels.set('Project', 'Run', 'CmdOrCtrl+R', () => { this.codearea.run() })

    this.acels.addTemplate(this.papersizes.buildMenuTemplate((dims) => this.plotarea.resize(dims)))
    this.acels.addTemplate({
      label: 'Orientation',
      submenu: [
        {label: 'Portrait', click: () => this.plotarea.orientation(true)},
        {label: 'Landscape', click: () => this.plotarea.orientation(false)}
      ]
    })

    this.acels.install(window)
    this.acels.pipe(this)
  }

  this.start = function() {
    this.codearea.start()
    this.plotarea.start()
  }

  this.whenOpen = (file, res) => {
    console.log(file, res)
    this.codearea.load(res)
  }

  this.bind = (event, fn) => {
    this.bindings[event] = fn
  }

  this.onKeyPress = (e, id = 'key-press') => {
    if (this.bindings[id]) {
      this.bindings[id](e)
    }
  }

  this.onKeyDown = (e, id = 'key-down') => {
    if (this.bindings[id]) {
      this.bindings[id](e)
    }
  }

  this.onKeyUp = (e, id = 'key-up') => {
    if (this.bindings[id]) {
      this.bindings[id](e)
    }
  }

  this.run = (txt) => this.api.run(txt)
}
