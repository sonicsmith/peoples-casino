const xmur3 = str => {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
  h = (h << 13) | (h >>> 19)
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return (h ^= h >>> 16) >>> 0
  }
}

const mulberry32 = a => {
  return () => {
    var t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const random = (seed, limit) => {
  const s = xmur3(seed)
  const rnd = mulberry32(s())
  return Math.floor(rnd() * limit)
}

export const getRandomIndex = (s, array) => {
  // Seed is concatenated with first item in array
  const firstItem =
    typeof array[0] !== "string" ? Object.values(array[0])[0] : array[0]
  const seed = `${firstItem}${s}`
  const rnd = random(seed, array.length)
  return rnd
}

export const getRandomItem = (s, array) => {
  const rnd = getRandomIndex(s, array)
  return array[rnd]
}

export const titleCase = str => {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

const padZero = (str, len) => {
  len = len || 2
  var zeros = new Array(len).join("0")
  return (zeros + str).slice(-len)
}

export const invertColor = hex => {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1)
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.")
  }
  // invert color components
  var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16)
  // pad each with zeros and return
  return "#" + padZero(r) + padZero(g) + padZero(b)
}

export const getRandomColor = seed => {
  var letters = "0123456789ABCDEF"
  console.log(random(seed, 16))
  var color = "#"
  for (var i = 0; i < 6; i++) {
    const newSeed = `${seed}${i}`
    color += letters[Math.floor(random(newSeed, 16))]
  }
  return color
}
