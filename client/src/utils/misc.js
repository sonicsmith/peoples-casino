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
  const firstItem = typeof array[0] !== "string" ? array[0].name : array[0]
  const seed = `${firstItem}${s}`
  console.log(seed)
  const rnd = random(seed, array.length)
  return rnd
}

export const getRandomItem = (s, array) => {
  const rnd = getRandomIndex(s, array)
  return array[rnd]
}
