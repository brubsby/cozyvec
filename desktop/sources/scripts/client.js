'use strict'

function Client() {
  this.el = document.createElement('div')
  this.el.id = 'cozyvec'

  this.code = new Code(this)

  this.install = function(host = document.body) {
    this._wrapper = document.createElement('div')
    this._wrapper.id = 'wrapper'

    this.code.install(this._wrapper)
    this.el.appendChild(this._wrapper)
    host.appendChild(this.el)
  }

  this.start = function () {
    this.code.start()
    // this.loop()
  }
}
