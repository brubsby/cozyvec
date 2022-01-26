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

    this._input.onkeydown = (e) => {
      if (e.key === "Tab" && !e.ctrlKey) { e.preventDefault(); this.inject('  ') }
    }
  }

  this.start = function() {
    this.load(this.splash)
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

  this.inject = function (injection, at = this._input.selectionStart) {
    document.execCommand('insertText', false, injection)
    this._input.selectionEnd = at + injection.length
  }

  this.setLog = function(msg) {
    msg = msg || '\u00a0'
    if (msg !== this._log.textContent) {
      this._log.textContent = msg
    }
  }

  this.setInfo = function() {
    const info = `${client.plotarea.paperName} : ${client.plotarea.paperWidth} x ${client.plotarea.paperHeight} mm : ${client.plotarea.penWidthMM.toFixed(2)} mm : ${client.plotarea.isPortrait ? "P" : "L"} : ${this._input.value.length}`
    if (info !== this._docs.textContent) {
      this._docs.textContent = `${info}`
    }
  }

  this.splash = Math.random() > .01 ?
`// Welcome to cozyvec!

// cmdorctrl+G for documentation
// cmdorctrl+R to run
// cmdorctrl+E to export SVG
// cmdorctrl+I to export image

paper("letter", true)
pen(.6)

frequency = random(0.005, 0.04)
amplitude = random(3, 9)
octaves = floor(random(1, 3.25))
num_lines = random(200, 300)
verts_per_line = 999

for(i = 0; i < num_lines; i++) {
  t = 0
  for(j = 0; j < verts_per_line; j++) {
    y = HEIGHT * i / num_lines
    x = WIDTH * j / verts_per_line
    y = y + noise( [x,y], frequency, amplitude, octaves )
    if(abs(WIDTH/2-x) + abs(HEIGHT/2-y) < min(W,H)/4 ) {
      ( t++ ? lineTo : moveTo )( x, y )
    } else {
      t = 0
    }
  }
}`
:
`// Welcome to cozyvec!

// cmdorctrl+G for documentation
// cmdorctrl+R to run
// cmdorctrl+E to export SVG
// cmdorctrl+I to export image

paper("letter", true)
pen(.6)

frequency = random(0.005, 0.04)
amplitude = random(3, 9)
octaves = floor(random(1, 3.25))
num_lines = random(200, 300)
verts_per_line = 999

function isEllipse(x, y, X, Y, a, b) {
    return pow(X-x, 2) / pow(a, 2) + pow(Y-y, 2) / pow(b, 2) < 1
}

function isCylinder(x, y, X, headY, assY, A, headB, assB) {
    isHead = isEllipse(x, y, X, headY, A, headB)
    isBody = (abs(X-x) < A)
              && (abs(headY/2+assY/2 - y) < assY/2-headY/2)
    isAss = isEllipse(x, y, X, assY, A, assB)
    return isHead || isBody || isAss
}

headX = WIDTH/2
headY = HEIGHT/3
assY = HEIGHT/3 + 100
headR = 60
assB = 30
legR = 20
legXL = headX - (headR - legR)
legXR = headX + (headR - legR)
legH = 48
bpW = 24
bpR = 6
visorX = legXR
visorY = headY + headR / 3
visorA = 44
visorB = 32
vW = 4

for(i = 0; i < num_lines; i++) {
  t = 0
  for(j = 0; j < verts_per_line; j++) {
    y = HEIGHT * i / num_lines
    x = WIDTH * j / verts_per_line
    y = y + noise( [x,y], frequency, amplitude, octaves )

    isLeftLeg = isCylinder(x, y, legXL, assY, assY+legH, legR, legR, legR)
    isRightLeg = isCylinder(x, y, legXR, assY, assY+legH, legR, legR, legR)
    isBackpack = isCylinder(x, y, headX-headR, headY, assY, bpW, bpR, bpR)

    isInnerVisor = isEllipse(x, y, visorX, visorY, visorA, visorB)
    isOuterVisor = isEllipse(x, y, visorX, visorY, visorA + vW, visorB + vW)
                  && !isInnerVisor

    isBody = isCylinder(x, y, headX, headY, assY, headR, headR, assB)

    if (
      (isBody || isLeftLeg || isRightLeg || isBackpack || isInnerVisor)
      && !isOuterVisor
    ) {
      ( t++ ? lineTo : moveTo )( x, y )
    } else {
      t = 0
    }
  }
}`
}
