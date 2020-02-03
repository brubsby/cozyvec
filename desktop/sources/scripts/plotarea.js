'use strict'

function PlotArea(client) {
  this.el = document.createElement('canvas')
  this.el.id = 'plotarea'

  this.width = this.el.width
  this.height = this.el.height
  this.ratio = window.devicePixelRatio
  this.context = this.el.getContext('2d')

  this.lastX = 0
  this.lastY = 0
  this.needsNewPath = true;

  this.install = function(host) {
    // this.el.appendChild(this._paper)
    host.appendChild(this.el)
  }

  this.start = function() {
  }

  this.moveLastCoords = function(x,y) {
    this.lastX = x
    this.lastY = y
  }

  this.lineTo = function(x,y) {
    this.context.beginPath()
    this.context.moveTo(this.lastX, this.lastY)
    this.context.lineTo(x,y)
    this.moveLastCoords(x,y)
    this.context.stroke()
  }

  this.moveTo = function(x,y) {
    this.moveLastCoords(x, y)
  }
}
