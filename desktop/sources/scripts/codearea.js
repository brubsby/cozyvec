'use strict'

function CodeArea(client) {
  this.el = document.createElement('div')
  this.el.id = 'codearea'
  this._input = document.createElement('textarea')

  this.install = function(host) {
    this.el.appendChild(this._input)
    host.appendChild(this.el)
    this._input.setAttribute('autocomplete', 'off')
    this._input.setAttribute('autocorrect', 'off')
    this._input.setAttribute('autocapitalize', 'off')
    this._input.setAttribute('spellcheck', 'false')
  }

  this.start = function() {
    this._input.focus()
  }

  this.run = function(txt = this._input.value) {
    client.run(txt)
  }

  this.load = function(txt) {
    this._input.value = txt
  }

  this.clear = function() {
    this.load('')
  }
}
