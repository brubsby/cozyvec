function Api(client) {
  this.simplex = new SimplexNoise()

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
    [this.seed.bind(this), ["seed", "srnd", "seedRandom"]],
    [this.noise.bind(this), ["nse", "noise"]],
    [client.plotarea.width, ["W", "WIDTH"]],
    [client.plotarea.height, ["H", "HEIGHT"]],
    [client.plotarea.lineTo.bind(client.plotarea), ["l2", "lineTo"]],
    [client.plotarea.moveTo.bind(client.plotarea), ["m2", "moveTo"]],
    [(x) => Math.pow(x,2), ["sqr"]],
    [(x) => Math.pow(x,3), ["cub", "cube"]],
    [(x1,y1,x2,y2) => Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2)), ["dst", "distance"]],
    [(low,x,high) => Math.max(Math.min(x,high),low), ["mid"]]
  ]

  this.run = function(txt) {
    // let functionBody = [
    // "'use strict'",
    // ""
    // ].join("\n")
    // functionBody += txt
    const flatApi = {}
    for (const parameterList of this.builtins()) {
      for (const alias of parameterList[1]) {
        flatApi[alias] = parameterList[0]
      }
    }
    const drawFunction = new Function(...Object.keys(flatApi),txt)
    client.plotarea.reset()
    this.seed()
    drawFunction(...Object.values(flatApi))
  }
}
