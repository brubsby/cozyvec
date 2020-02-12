'use strict'

function CodeArea(client) {
  this.el = document.createElement('div')
  this.el.id = 'codearea'
  this._input = document.createElement('textarea')
  this._status = document.createElement('div'); this._status.id = 'status'
  this._log = document.createElement('div'); this._log.id = 'log'
  this._docs = document.createElement('div'); this._docs.id = 'help'

  this.install = function(host) {
    this.el.appendChild(this._input)
    host.appendChild(this.el)
    this._status.appendChild(this._log)
    this._status.appendChild(this._docs)
    this.el.appendChild(this._status)
    this._input.setAttribute('autocomplete', 'off')
    this._input.setAttribute('autocorrect', 'off')
    this._input.setAttribute('autocapitalize', 'off')
    this._input.setAttribute('spellcheck', 'false')
    this._input.addEventListener('input', this.onInput)
    this._input.addEventListener('click', this.onClick)
  }

  this.start = function() {
    this._input.focus()
    this.setLog()
  }

  this.run = function(txt = this._input.value) {
    client.run(txt)
  }

  this.onInput = () => {
    this.setInfo()
  }

  this.onClick = () => {
    this.setInfo()
  }

  this.load = function(txt) {
    this._input.value = txt
  }

  this.clear = function() {
    this.load('')
  }

  this.setLog = function(msg) {
    msg = msg || '\u00a0'
    if (msg !== this._log.textContent) {
      this._log.textContent = msg
    }
  }

  this.setInfo = function() {
    const info = `${client.plotarea.paperName} Paper : ${client.plotarea.paperWidth} x ${client.plotarea.paperHeight} mm : ${client.plotarea.isPortrait ? "Portrait" : "Landscape"} : ${this._input.value.length}`
    if (info !== this._docs.textContent) {
      this._docs.textContent = `${info}`
    }
  }
}
