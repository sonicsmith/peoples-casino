import { getRandomItem, getRandomIndex } from "./../utils/misc"
import names from "./names"
import containers from "./containers"
import subjects from "./subjects"
import objects from "./objects"
import imageAttributes from "./imageAttributes"

const getIsMale = tokenId => {
  const nameIndex = getRandomIndex(tokenId, names.first)
  return nameIndex % 2 === 1
}

export const getName = tokenId => {
  const first = getRandomItem(tokenId, names.first)
  const last = getRandomItem(tokenId, names.last)
  const container = getRandomItem(tokenId, containers).name
  const object = getRandomItem(tokenId, objects).name
  return `${first} ${last}'s ${container} of ${object}`
}

export const getDescription = tokenId => {
  const container = getRandomItem(tokenId, containers).name
  const subject = getRandomItem(tokenId, subjects).name
  const object = getRandomItem(tokenId, objects).name
  return `[TODO: Greeting] 
  Wanna try your luck!?
  You can make a whole heap of money by finding some ${subject} 
  in my ${container} full of ${object}`
}

export const getDescriptionEmojis = tokenId => {
  const container = getRandomItem(tokenId, containers).emoji
  const subject = getRandomItem(tokenId, subjects).emoji
  const object = getRandomItem(tokenId, objects).emoji
  return {
    container,
    subject,
    object
  }
}

export const getImageAttributes = tokenId => {
  const sex = getIsMale(tokenId) ? "male" : "female"
  const {
    topTypes,
    facialHairTypes,
    accessoriesTypes,
    hairColors,
    clotheTypes,
    eyeTypes,
    eyebrowTypes,
    mouthTypes,
    skinTypes
  } = imageAttributes
  return {
    topTypes: getRandomItem(tokenId, topTypes[sex]),
    facialHairTypes: getRandomItem(tokenId, facialHairTypes[sex]),
    accessoriesTypes: getRandomItem(tokenId, accessoriesTypes),
    hairColors: getRandomItem(tokenId, hairColors),
    clotheTypes: getRandomItem(tokenId, clotheTypes),
    eyeTypes: getRandomItem(tokenId, eyeTypes),
    eyebrowTypes: getRandomItem(tokenId, eyebrowTypes),
    mouthTypes: getRandomItem(tokenId, mouthTypes),
    skinTypes: getRandomItem(tokenId, skinTypes)
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
