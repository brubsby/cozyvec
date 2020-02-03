'use strict'

function Client() {
  this.el = document.createElement('div')
  this.el.id = 'cozyvec'

  this.codearea = new CodeArea(this)
  this.plotarea = new PlotArea(this)

  this.install = function(host = document.body) {
    this._wrapper = document.createElement('div')
    this._wrapper.id = 'wrapper'

    this.codearea.install(this._wrapper)
    this.plotarea.install(this._wrapper)
    this.el.appendChild(this._wrapper)
    host.appendChild(this.el)
  }

  this.start = function () {
    this.codearea.start()
    this.plotarea.start()
    // this.loop()
  }


}
