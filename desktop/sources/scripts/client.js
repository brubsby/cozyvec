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

  this.api = [
    [Math.PI, ["PI"]],
    [Math.PI*2, ["TAU", "TWO_PI"]],
    [Math.PI/2, ["HPI", "HALF_PI"]],
    [Math.PI/4, ["QPI", "QUARTER_PI"]],
    [Math.pow, ["pow"]],
    [Math.sqrt, ["sqrt"]],
    [Math.abs, ["abs"]],
    [Math.ceil, ["ceil"]],
    [Math.floor, ["flr", "floor"]],
    [Math.sign, ["sgn", "sign"]],
    [Math.sin, ["sin"]],
    [Math.cos, ["cos"]],
    [Math.tan, ["tan"]],
    [Math.asin, ["asin"]],
    [Math.acos, ["acos"]],
    [Math.atan, ["atan"]],
    [Math.atan2, ["atan2"]],
    [Math.min, ["min"]],
    [Math.max, ["max"]],
    [Math.random, ["rnd", "random"]],
    [this.plotarea.width, ["W", "WIDTH"]],
    [this.plotarea.height, ["H", "HEIGHT"]],
    [this.plotarea.lineTo.bind(this.plotarea), ["L2", "lineTo"]],
    [this.plotarea.moveTo.bind(this.plotarea), ["M2", "moveTo"]],
    [(x) => Math.pow(x,2)), ["sqr"]],
    [(x) => Math.pow(x,3)), ["cub"]],
    [(x1,y1,x2,y2) => Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2)), ["dst", "distance"]],
    [(low,x,high) => Math.max(Math.min(x,high),low), ["mid"]]
  ]

  this.run = function(txt) {
    let functionBody = [
    "'use strict'",
    ""
    ].join("\n")
    functionBody += txt
    const flatApi = {}
    for (const parameterList of this.api) {
      for (const alias of parameterList[1]) {
        flatApi[alias] = parameterList[0]
      }
    }
    const drawFunction = new Function(...Object.keys(flatApi),functionBody)
    drawFunction(...Object.values(flatApi))
  }
}
