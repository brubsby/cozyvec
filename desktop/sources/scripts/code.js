'use strict'

function Code(client) {
  this.el = document.createElement('div')
  this.el.id = 'code'
  this._input = document.createElement('textarea')

  this.install = function(host) {
    this.el.appendChild(this._input)
    host.appendChild(this.el)
  }

  this.start = function() {
    this._input.focus()
  }
}
