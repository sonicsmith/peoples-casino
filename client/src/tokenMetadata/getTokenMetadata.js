import {
  getRandomItem,
  getRandomIndex,
  invertColor,
  getRandomColor
} from "./../utils/misc"
import names from "./names"
import { greetings, moneyAdjectives, moneySlangs } from "./misc"
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

export const getDescriptionArray = tokenId => {
  const greeting = getRandomItem(tokenId, greetings)
  const moneyAdjective = getRandomItem(tokenId, moneyAdjectives)
  const moneySlang = getRandomItem(tokenId, moneySlangs)
  const container = getRandomItem(tokenId, containers).name
  const subject = getRandomItem(tokenId, subjects).name
  const object = getRandomItem(tokenId, objects).name
  return [
    `${greeting}, wanna try your luck!?`,
    `You can make ${moneyAdjective} ${moneySlang} by finding some ${subject} 
  in my ${container} full of ${object}!`
  ]
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
  const background = getRandomColor(`${tokenId}`)
  const border = invertColor(background)
  return {
    topTypes: getRandomItem(tokenId, topTypes[sex]),
    facialHairTypes: getRandomItem(tokenId, facialHairTypes[sex]),
    accessoriesTypes: getRandomItem(tokenId, accessoriesTypes),
    hairColors: getRandomItem(tokenId, hairColors),
    clotheTypes: getRandomItem(tokenId, clotheTypes),
    eyeTypes: getRandomItem(tokenId, eyeTypes),
    eyebrowTypes: getRandomItem(tokenId, eyebrowTypes),
    mouthTypes: getRandomItem(tokenId, mouthTypes),
    skinTypes: getRandomItem(tokenId, skinTypes),
    colorScheme: { background, border }
  }
}

export const getTokenMetadata = tokenId => {
  return {
    name: getName(tokenId),
    description: getDescriptionArray(tokenId),
    descriptionEmojis: getDescriptionEmojis(tokenId),
    imageAttributes: getImageAttributes(tokenId)
  }
}
