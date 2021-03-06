function Api(client) {
  this.simplex = new SimplexNoise()
  this.newFunctionStartLine = (() => {
    try {(new Function('undefined_function()'))()}
    catch(e) {
      if(e.lineNumber || e.line) {
        return e.lineNumber
      } else {
        const match = e.stack.match(/(<anonymous>|Function):(\d+):\d+/)
        if (match) {
          return parseInt(match[2])
        }
      }
    return 1
  }})()
  this.newFunctionLineOffset = this.newFunctionStartLine - 1

  this.seed = (seed = 0) => {
    Math.seedrandom(seed)
    this.simplex = new SimplexNoise(seed)
  }

  this.noise = (coords, frequency = 1, amplitude = 1, octaves = 1, lacunarity = 2, gain = 0.5) => {
    var octave_amplitude = amplitude
    var octave_frequency = frequency
    var result = 0
    for (var i = 0; i < octaves; i++) {
      if (Array.isArray(coords)) {
        switch (coords.length) {
          case 1:
            result += octave_amplitude * this.simplex.noise2D(octave_frequency * coords[0], 0)
            break
          case 2:
            result += octave_amplitude * this.simplex.noise2D(octave_frequency * coords[0], octave_frequency * coords[1])
            break
          case 3:
            result += octave_amplitude * this.simplex.noise3D(octave_frequency * coords[0], octave_frequency * coords[1], octave_frequency * coords[2])
            break
          case 4:
            result += octave_amplitude * this.simplex.noise4D(octave_frequency * coords[0], octave_frequency * coords[1], octave_frequency * coords[2], octave_frequency * coords[3])
            break
        }
      } else {
          result += octave_amplitude * this.simplex.noise2D(octave_frequency * coords, 0)
      }
      octave_amplitude *= gain
      octave_frequency *= lacunarity
    }
    return result
  }

  this.random = (param1, param2) => {
    if (param2 !== undefined) {
      if (param1 !== undefined) {
        return param1 + Math.random() * (param2 - param1)
      } else {
        throw new TypeError("usage: random([low,[high]])")
      }
    } else {
      if (param1 !== undefined) {
        return Math.random() * param1
      } else {
        return Math.random()
      }
    }
  }

  this.mid = (low,x,high) => {
    return Math.max(Math.min(x,high),low)
  }

  this.smooth_mid = (low,x,high) => {
    const v = this.mid(0,(x-low)/(high-low),1)
    return v * v * v * ( v * ( v * 6 - 15 ) + 10 ) * (high - low) + low
  }

  this.paper = (...args) => {
    const usageMsg = "usage: paper|ppr (s)|(w,h[,n[,o]])"
    if(args.length == 0) throw TypeError(usageMsg)
    if(typeof args[0] === 'string' || args[0] instanceof String) {
      const paper_lookup = client.papersizes.lookup(args[0])
      if(paper_lookup) {
        this.customPaper(paper_lookup[1], paper_lookup[2], paper_lookup[0], args[1])
      } else {
        throw new TypeError(`"${args[0]}" paper not found.`)
      }
    } else {
      if(args.length == 1) throw TypeError(usageMsg)
      this.customPaper(...args)
    }
  }

  this.customPaper = (width,height,name,isPortrait) => {
    name = name || 'Custom'
    client.plotarea.resize([width,height],name,isPortrait)
  }

  this.marginBox = (...args) => {
    const w = client.plotarea.paperWidth
    const h = client.plotarea.paperHeight
    if(args.length == 0) {
      const m = 40;
      return [m, m, w-m, h-m]
    }
    if(args.length == 1) {
      const m = args[0];
      return [m, m, w-m, h-m]
    }
    if(args.length == 2) {
      const v = args[0];
      const z = args[1];
      return [z, v, w-z, h-v]
    }
    if(args.length == 3) {
      const t = args[0];
      const z = args[1];
      const b = args[2];
      return [z, t, w-z, h-b]
    }
    if(args.length == 4) {
      const t = args[0];
      const r = args[1];
      const b = args[2];
      const l = args[3]
      return [l, t, w-r, h-b]
    }
  }

  this.log = function(s = '') {
    client.codearea.setLog(s)
  }

  this.error = (s = 'Error') => {
    throw new Error(s)
  }

  this.builtins = () => [
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
    [Math.atan2, ["at2", "atan2"]],
    [Math.min, ["min"]],
    [Math.max, ["max"]],
    [this.random, ["rnd", "random"]],
    [this.seed.bind(this), ["srnd", "seedRandom"]],
    [this.noise.bind(this), ["nse", "noise"]],
    [client.plotarea.paperWidth, ["W", "WIDTH"]],
    [client.plotarea.paperHeight, ["H", "HEIGHT"]],
    [client.plotarea.penWidth.bind(client.plotarea), ["pen"]],
    [client.plotarea.lineTo.bind(client.plotarea), ["l2", "lineTo"]],
    [client.plotarea.moveTo.bind(client.plotarea), ["m2", "moveTo"]],
    [client.plotarea.closePath.bind(client.plotarea), ["clsp", "closePath"]],
    [(x) => Math.pow(x,2), ["sqr", "square"]],
    [(x) => Math.pow(x,3), ["cub", "cube"]],
    [(x1,y1,x2,y2) => Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2)), ["dst", "distance"]],
    [this.mid, ["mid"]],
    [this.smooth_mid, ["smid","smoothMid"]],
    [()=>{}, ["ppr", "paper"]],
    [this.marginBox, ["mbox", "marginBox"]],
    [this.error, ["err", "error"]],
    [this.log, ["log"]]
  ]

  this.run = function(txt) {
    this.seed((new Date()).getTime())
    try {
      client.plotarea.reset()
      const beginningPaper = txt.match(/^(\s|\/\/[^\n]*\n|\/\*(.|\n)*?\*\/)*(ppr|paper)\([^\)]*\)/)
      const allPapers = txt.match(/\b(ppr|paper)\([^\)]*\)/g)
      if (allPapers && ((allPapers.length == 1 && !beginningPaper) || (allPapers.length > 1))) {
        throw EvalError("call ppr|paper() only once at start")
      }
      if (beginningPaper) {
        new Function("ppr","paper",beginningPaper[0])(this.paper,this.paper)
      }
      const flatApi = {}
      for (const parameterList of this.builtins()) {
        for (const alias of parameterList[1]) {
          flatApi[alias] = parameterList[0]
        }
      }
      const drawFunction = new Function(...Object.keys(flatApi),txt)
      const globalKeys = Object.keys(globalThis)
      drawFunction(...Object.values(flatApi))
      client.plotarea.flushAll()
      //delete global variables the user function created
      Object.keys(globalThis).filter(x => !globalKeys.includes(x)).forEach(x => delete globalThis[x])
    } catch(e) {
      var lineInfo = e.stack.match(/(<anonymous>|Function):(\d+:\d+)/)
      if (lineInfo) {
        const lineInfoSplit = lineInfo[2].split(':')
        lineInfo = `${lineInfoSplit[0]-this.newFunctionLineOffset}:${lineInfoSplit[1]}`
      }
      client.message(e.message + (lineInfo ? ` : ${lineInfo}` : ''))
    }
  }
}
