function Api(client) {
  this.simplex = new SimplexNoise()
  this.newFunctionStartLine = (() => {
    try {(new Function('undefined_function()'))()}
    catch(e) {return parseInt(e.stack.match('(?<=<anonymous>:)\\d+'))}
    return 1
  })()
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
    if (typeof args[0] === 'string' || args[0] instanceof String) {
      const paper_lookup = client.papersizes.SIZES_DICT[args[0]]
      if(paper_lookup) {
        this.customPaper(paper_lookup[0], paper_lookup[1], args[0], args[1])
      } else {
        throw new TypeError(`"${args[0]}" paper not found.`)
      }
    } else {
      this.customPaper(...args)
    }
  }

  this.customPaper = (width,height,name,isPortrait) => {
    name = name || 'Custom'
    client.plotarea.resize([width,height],name,isPortrait)
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
    [client.plotarea.width, ["W", "WIDTH"]],
    [client.plotarea.height, ["H", "HEIGHT"]],
    [client.plotarea.penWidth.bind(client.plotarea), ["pen"]],
    [client.plotarea.lineTo.bind(client.plotarea), ["l2", "lineTo"]],
    [client.plotarea.moveTo.bind(client.plotarea), ["m2", "moveTo"]],
    [client.plotarea.closePath.bind(client.plotarea), ["clsp", "closePath"]],
    [(x) => Math.pow(x,2), ["sqr", "square"]],
    [(x) => Math.pow(x,3), ["cub", "cube"]],
    [(x1,y1,x2,y2) => Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2)), ["dst", "distance"]],
    [this.mid, ["mid"]],
    [this.smooth_mid, ["smid"]],
    [this.paper, ["ppr", "paper"]]
  ]

  this.run = function(txt) {
    txt += "\nmoveTo(0,0)"
    this.seed((new Date()).getTime())
    const flatApi = {}
    for (const parameterList of this.builtins()) {
      for (const alias of parameterList[1]) {
        flatApi[alias] = parameterList[0]
      }
    }
    client.plotarea.reset()
    try {
      const drawFunction = new Function(...Object.keys(flatApi),txt)
      drawFunction(...Object.values(flatApi))
    } catch(e) {
      var lineInfo = e.stack.match('(?<=<anonymous>:)\\d+:\\d+')
      if (lineInfo) {
        const lineInfoSplit = lineInfo[0].split(':')
        lineInfo = `${lineInfoSplit[0]-this.newFunctionLineOffset}:${lineInfoSplit[1]}`
      }
      client.message(e.message + (lineInfo ? ` : ${lineInfo}` : ''))
    }
  }
}
