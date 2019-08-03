import random from "random"
import seedrandom from "seedrandom"
import names from "./names"
import containers from "./containers"
import subjects from "./subjects"
import objects from "./objects"
import imageAttributes from "./imageAttributes"

const getRandom = array => {
  const rnd = random.int(0, array.length - 1)
  console.log(array[rnd])
  return array[rnd]
}

export const getName = tokenId => {
  random.use(seedrandom(`${tokenId}1`))
  const first = getRandom(names.first)
  const last = getRandom(names.last)
  return `${first} ${last}`
}

export const getDescription = tokenId => {
  random.use(seedrandom(`${tokenId}2`))
  const container = getRandom(containers.name)
  const subject = getRandom(subjects.name)
  const object = getRandom(objects.name)
  return `Welcome to the ${container} of ${object}, 
  where you can make a whole heap of money by finding a ${subject} 
  in my ${container} full of ${object}`
}

export const getDescriptionEmojis = tokenId => {
  random.use(seedrandom(`${tokenId}2`))
  const container = getRandom(containers.emoji)
  const subject = getRandom(subjects.emoji)
  const object = getRandom(objects.emoji)
  return {
    container,
    subject,
    object
  }
}

export const getImageAttributes = tokenId => {
  random.use(seedrandom(`${tokenId}3`))
  return {
    topTypes: getRandom(imageAttributes.topTypes),
    accessoriesTypes: getRandom(imageAttributes.accessoriesTypes),
    hairColors: getRandom(imageAttributes.hairColors),
    facialHairTypes: getRandom(imageAttributes.facialHairTypes),
    clotheTypes: getRandom(imageAttributes.clotheTypes),
    eyeTypes: getRandom(imageAttributes.eyeTypes),
    eyebrowTypes: getRandom(imageAttributes.eyebrowTypes),
    mouthTypes: getRandom(imageAttributes.mouthTypes),
    skinTypes: getRandom(imageAttributes.skinTypes)
  }
}

export const getTokenMetadata = tokenId => {
  return {
    name: getName(tokenId),
    description: getDescription(tokenId),
    descriptionEmojis: getDescriptionEmojis(tokenId),
    imageAttributes: getImageAttributes(tokenId)
  }
}
