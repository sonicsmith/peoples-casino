import {
  getRandomItem,
  getRandomIndex,
  invertColor,
  getRandomColor,
  titleCase
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
  const s = last.charAt(last.length - 1) === "s" ? "" : "s"
  return titleCase(`${first} ${last}'${s} ${container} of ${object}`)
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
    `You can make ${moneyAdjective} ${moneySlang} by finding some ${subject} in my ${container} full of ${object}!`
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
  const tokenBackground = getRandomColor(tokenId)
  const background = invertColor(tokenBackground)
  let accessories = "Blank"
  // Every 3rd token has accessories
  if (tokenId % 3 === 0) {
    accessories = getRandomItem(tokenId, accessoriesTypes)
  }
  return {
    topTypes: getRandomItem(tokenId, topTypes[sex]),
    facialHairTypes: getRandomItem(tokenId, facialHairTypes[sex]),
    accessoriesTypes: accessories,
    hairColors: getRandomItem(tokenId, hairColors),
    clotheTypes: getRandomItem(tokenId, clotheTypes),
    eyeTypes: getRandomItem(tokenId, eyeTypes),
    eyebrowTypes: getRandomItem(tokenId, eyebrowTypes),
    mouthTypes: getRandomItem(tokenId, mouthTypes),
    skinTypes: getRandomItem(tokenId, skinTypes),
    colorScheme: { tokenBackground, background }
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

const getAttributes = tokenId => {
  const sex = getIsMale(tokenId) ? "male" : "female"
  const generation = Math.floor(Number(tokenId) / 1000) + 1
  return [
    {
      trait_type: "sex",
      value: sex
    },
    {
      display_type: "number",
      trait_type: "generation",
      value: generation
    }
  ]
}

export const getAPITokenMetadata = tokenId => {
  return {
    name: getName(tokenId),
    description: getDescriptionArray(tokenId).join(" "),
    external_url: `http://peoplescasino.online/token/${tokenId}`,
    background_color: getRandomColor(tokenId),
    attributes: getAttributes(tokenId)
  }
}
