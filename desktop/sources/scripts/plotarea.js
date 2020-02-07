'use strict'

function PlotArea(client) {
  this.el = document.createElement('canvas')
  this.el.id = 'plotarea'

  this.isPortrait = true
  this.pixelRatio = window.devicePixelRatio
  this.context = this.el.getContext('2d')

  this.lastX = 0
  this.lastY = 0

  this.install = function(host) {
    host.appendChild(this.el)
    window.addEventListener('resize', (e) => { this.resize() }, false)
  }

  this.start = function() {
    this.resize([ 216, 279 ], true, 30)
  }

  this.orientation = function(isPortrait) {
    this.isPortrait = isPortrait
    this.resize()
  }

  this.resize = function(paperDims = [this.paperWidth, this.paperHeight], isPortrait = this.isPortrait, margin = this.margin) {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const minPaperDim = Math.min(paperDims[0], paperDims[1])
    const maxPaperDim = Math.max(paperDims[0], paperDims[1])
    this.margin = margin
    this.paperWidth = isPortrait ? minPaperDim : maxPaperDim
    this.paperHeight = isPortrait ? maxPaperDim : minPaperDim
    this.paperAspect = this.paperWidth / this.paperHeight
    this.containerWidth = windowWidth / 2 - this.margin * 2
    this.containerHeight = windowHeight - this.margin * 2
    this.containerAspect = this.containerWidth / this.containerHeight
    if (this.containerAspect > this.paperAspect) {
      this.height = Math.floor(windowHeight - this.margin * 2)
      this.width = Math.floor(this.height * this.paperAspect)
      this.verticalMargin = this.margin
      this.horizontalMargin = Math.floor((windowWidth / 2 - this.width) / 2)
    } else {
      this.width = Math.floor(windowWidth / 2 - margin * 2)
      this.height = Math.floor(this.width / this.paperAspect)
      this.horizontalMargin = this.margin
      this.verticalMargin = Math.floor((windowHeight - this.height) / 2)
    }
    this.el.width = this.width
    this.el.height = this.height
    this.el.style.width = this.width + 'px'
    this.el.style.height = this.height + 'px'
    this.el.style.margin = this.verticalMargin + 'px ' + this.horizontalMargin + 'px'
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

  this.clear = function() {
    this.context.clearRect(0, 0, this.width, this.height)
  }

  this.reset = function() {
    this.clear()
    this.moveLastCoords(0, 0)
  }
}
