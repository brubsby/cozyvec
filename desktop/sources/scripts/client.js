'use strict'

function Client() {
  this.el = document.createElement('div')
  this.el.id = 'cozyvec'

  this.acels = new Acels(this)
  this.codearea = new CodeArea(this)
  this.plotarea = new PlotArea(this)
  this.papersizes = new PaperSizes()

  this.bindings = {}

  this.install = function(host = document.body) {
    this._wrapper = document.createElement('div')
    this._wrapper.id = 'wrapper'

    this.codearea.install(this._wrapper)
    this.plotarea.install(this._wrapper)
    this.el.appendChild(this._wrapper)
    host.appendChild(this.el)

    // this.acels.set('File', 'New', 'CmdOrCtrl+N', () => { this.source.new(); this.surface.clear(); this.commander.clear() })
    // this.acels.set('File', 'Save', 'CmdOrCtrl+S', () => { this.source.download('ronin', 'lisp', this.commander._input.value, 'text/plain') })
    // this.acels.set('File', 'Export Image', 'CmdOrCtrl+E', () => { this.source.download('ronin', 'png', this.surface.el.toDataURL('image/png', 1.0), 'image/png') })
    // this.acels.set('File', 'Open', 'CmdOrCtrl+O', () => { this.source.open('lisp', this.whenOpen) })

    this.acels.add('Edit', 'undo')
    this.acels.add('Edit', 'redo')
    this.acels.add('Edit', 'cut')
    this.acels.add('Edit', 'copy')
    this.acels.add('Edit', 'paste')
    this.acels.add('Edit', 'selectAll')

    this.acels.set('Project', 'Run', 'CmdOrCtrl+R', () => { this.codearea.run() })
    // this.acels.set('Project', 'Reload Run', 'CmdOrCtrl+Shift+R', () => { this.source.revert(); this.commander.run() })
    // this.acels.set('Project', 'Re-Indent', 'CmdOrCtrl+Shift+I', () => { this.commander.reindent() })
    // this.acels.set('Project', 'Clean', 'Escape', () => { this.commander.cleanup() })

    this.acels.addTemplate(this.papersizes.buildMenuTemplate((dims) => {}))

    this.acels.install(window)
    this.acels.pipe(this)
  }

  this.start = function() {
    this.codearea.start()
    this.plotarea.start()
    // this.loop()
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

  this.run = function(txt) {
    let functionBody = [
    "'use strict'",
    ""
    ].join("\n")
    functionBody += txt
    const drawFunction = new Function("W","H","PI","TAU","L2","M2",functionBody)
    drawFunction(this.plotarea.width, this.plotarea.height, Math.PI, Math.PI*2, this.plotarea.lineTo.bind(this.plotarea), this.plotarea.moveTo.bind(this.plotarea))
  }
}
