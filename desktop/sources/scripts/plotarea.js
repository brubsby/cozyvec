'use strict'

function PlotArea(client) {
  this.el = document.createElement('canvas')
  this.el.id = 'plotarea'

  this.isPortrait = true
  this.pixelRatio = window.devicePixelRatio
  this.context = this.el.getContext('2d')
  this.polylines = []
  this.currentPolyline = []
  this.penWidthMM = 0.3

  this.lastX = 0
  this.lastY = 0
  this.lastMoveToX = 0
  this.lastMoveToY = 0

  this.install = function(host) {
    host.appendChild(this.el)
    window.addEventListener('resize', (e) => { this.resize() }, false)
  }

  this.start = function() {
    this.resize([ 216, 279 ], "Letter", true, 30)
  }

  this.orientation = function(isPortrait) {
    this.isPortrait = isPortrait
    this.resize()
  }

  this.orientationToggle = function() {
    this.orientation(!this.isPortrait)
  }

  this.mmToPixel = x => x / this.paperHeight * this.height

  this.mmCoordToPixelCoord = function(mm_coord) {
    if (Array.isArray(mm_coord)) {
      return mm_coord.map(this.mmToPixel)
    } else {
        return this.mmToPixel(mm_cord)
    }
  }

  this.penWidth = function(width_mm) {
    this.penWidthMM = width_mm
    this.context.lineWidth = this.mmToPixel(width_mm)
    client.codearea.setInfo()
  }

  this.resize = function(paperDims = [this.paperWidth, this.paperHeight], name=this.paperName, isPortrait = this.isPortrait, margin = this.margin) {
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

    this.penWidth(this.penWidthMM)
    this.paperName = name
    this.isPortrait = isPortrait

    client.codearea.setInfo()
  }

  this.moveLastCoords = function(x,y) {
    this.lastX = x
    this.lastY = y
  }

  this.moveLastMoveToCoords = function(x,y) {
    this.lastMoveToX = x
    this.lastMoveToY = y
  }

  this.lineTo = function(mm_x,mm_y) {
    this.context.beginPath()
    this.context.moveTo(this.mmToPixel(this.lastX), this.mmToPixel(this.lastY))
    this.context.lineTo(this.mmToPixel(mm_x), this.mmToPixel(mm_y))
    this.context.stroke()
    this.currentPolyline.push([mm_x, mm_y])
    this.moveLastCoords(mm_x, mm_y)
  }

  this.moveTo = function(mm_x,mm_y) {
    if (this.currentPolyline.length > 1) this.polylines.push(this.currentPolyline)
    this.currentPolyline = [[mm_x, mm_y]]
    this.moveLastMoveToCoords(mm_x, mm_y)
    this.moveLastCoords(mm_x, mm_y)
  }

  this.closePath = function() {
    this.lineTo(this.lastMoveToX, this.lastMoveToY)
  }

  this.clear = function() {
    this.context.clearRect(0, 0, this.width, this.height)
    this.polylines = []
  }

  this.reset = function() {
    this.clear()
    this.moveLastCoords(0, 0)
    this.moveLastMoveToCoords(0, 0)
  }

  this.getSvg = function() {
    return this.polylinesToSVG(this.polylines, {paperDimensions: [this.paperWidth, this.paperHeight]})
  }

  this.polylinesToSVG = function(polylines, opt = {}) {
    const paperDimensions = opt.paperDimensions
    if (!paperDimensions) throw new TypeError('must specify dimensions currently')
    const decimalPlaces = 5

    let commands = []
    polylines.forEach(line => {
      line.forEach((point, j) => {
        const type = (j === 0) ? 'M' : 'L'
        const x = (point[0]).toFixed(decimalPlaces)
        const y = (point[1]).toFixed(decimalPlaces)
        commands.push(`${type} ${x} ${y}`)
      });
    });

    const svgPath = commands.join(' ')
    const viewWidth = (paperDimensions[0]).toFixed(decimalPlaces)
    const viewHeight = (paperDimensions[1]).toFixed(decimalPlaces)
    const fillStyle = opt.fillStyle || 'none'
    const strokeStyle = opt.strokeStyle || 'black'
    const lineWidth = opt.lineWidth !== undefined ? opt.lineWidth : this.penWidthMM

    return `<?xml version="1.0" standalone="no"?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
      "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg width="${paperDimensions[0]}mm" height="${paperDimensions[1]}mm"
         xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${viewWidth} ${viewHeight}">
     <g>
       <path d="${svgPath}" fill="${fillStyle}" stroke="${strokeStyle}" stroke-width="${lineWidth}mm" />
     </g>
  </svg>`
  }
}
