import {
  getRandomItem,
  invertColor,
  getRandomColor,
  titleCase
} from "./../utils/misc"
import names from "./names"
import {
  greetings,
  moneyAdjectives,
  moneySlangs,
  slotMachineSlangs,
  percentages
} from "./misc"
import subjects from "./subjects"
import objects from "./objects"
import imageAttributes from "./imageAttributes"

const getIsMale = tokenId => {
  return (tokenId % 75) % 2 === 1
}

export const getName = tokenId => {
  const first = names.first[tokenId % 75]
  const last = names.last[tokenId % 56]
  const object = getRandomItem(tokenId, objects).name
  const slotMachineSlang = getRandomItem(tokenId, slotMachineSlangs)
  const s = last.charAt(last.length - 1) === "s" ? "" : "s"
  return titleCase(
    `${first} ${last}'${s} ${object} themed ${slotMachineSlang}!`
  )
}

export const getDescriptionArray = tokenId => {
  const greeting = getRandomItem(tokenId, greetings)
  const moneyAdjective = getRandomItem(tokenId, moneyAdjectives)
  const moneySlang = getRandomItem(tokenId, moneySlangs)
  const subject = getRandomItem(tokenId, subjects).name
  const object = getRandomItem(tokenId, objects).name
  return [
    `${greeting}, wanna try your luck!?`,
    `You can make ${moneyAdjective} ${moneySlang} by 
    matching three ${subject} in my ${object} themed game!`
  ]
}

export const getDescriptionItems = tokenId => {
  const subject = getRandomItem(tokenId, subjects)
  const object = getRandomItem(tokenId, objects)
  return {
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
    clotheColors,
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
    clotheColors: getRandomItem(tokenId, clotheColors),
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
    descriptionItems: getDescriptionItems(tokenId),
    imageAttributes: getImageAttributes(tokenId)
  }
}

const getAttributes = tokenId => {
  const sex = getIsMale(tokenId) ? "male" : "female"
  const generation = Math.floor(Number(tokenId) / 1001) + 1
  const mouthType = getRandomItem(tokenId, imageAttributes.mouthTypes)
  const personalityMap = {
    Concerned: "concerned",
    Default: "easy going",
    Disbelief: "dispointed",
    Eating: "judgemental",
    Grimace: "uptight",
    Sad: "sad",
    ScreamOpen: "fearful",
    Serious: "serious",
    Smile: "happy",
    Tongue: "silly",
    Twinkle: "gentle"
  }
  const personality = personalityMap[mouthType]
  const colorMap = {
    Blue02: "Blue",
    Blue03: "Blue",
    Gray01: "Grey",
    Gray02: "Grey",
    Heather: "Navy",
    PastelBlue: "Blue",
    PastelGreen: "Green",
    PastelOrange: "Orange",
    PastelRed: "Red",
    PastelYellow: "Yellow"
  }
  const clotheColor = getRandomItem(tokenId, imageAttributes.clotheColors)
  const favouriteColor = colorMap[clotheColor] || clotheColor
  const enjoymentLevel = getRandomItem(tokenId, percentages)
  const favEmoji = getRandomItem(tokenId, subjects).emoji
  return [
    {
      trait_type: "sex",
      value: sex
    },
    {
      trait_type: "personality",
      value: personality
    },
    {
      trait_type: "favourite color",
      value: favouriteColor
    },
    {
      trait_type: "fav emoji",
      value: favEmoji
    },
    {
      display_type: "number",
      trait_type: "generation",
      value: generation
    },
    {
      display_type: "boost_percentage",
      trait_type: "enjoyment level",
      value: enjoymentLevel
    }
  ]
}

export const getAPITokenMetadata = tokenId => {
  return {
    name: getName(tokenId),
    description: getDescriptionArray(tokenId).join(" "),
    external_url: `http://peoplescasino.online/${tokenId}`,
    background_color: getRandomColor(tokenId),
    attributes: getAttributes(tokenId)
  }
}
