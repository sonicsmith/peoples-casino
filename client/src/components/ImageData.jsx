import React from "react"
import Avatar from "avataaars"
import random from "random"
import seedrandom from "seedrandom"
import {
  topTypes,
  accessoriesTypes,
  hairColors,
  facialHairTypes,
  clotheTypes,
  eyeTypes,
  eyebrowTypes,
  mouthTypes,
  skinTypes
} from "./Image/imageAttributes"

const getRandom = array => {
  const rnd = random.int(0, array.length - 1)
  console.log(array[rnd])
  return array[rnd]
}

const ImageData = ({ tokenId }) => {
  console.log("TokenId:", tokenId)
  random.use(seedrandom(`${tokenId}`))
  return (
    <Avatar
      avatarStyle="Transparent"
      topType={getRandom(topTypes)}
      accessoriesType={getRandom(accessoriesTypes)}
      hairColor={getRandom(hairColors)}
      facialHairType={getRandom(facialHairTypes)}
      clotheType={getRandom(clotheTypes)}
      eyeType={getRandom(eyeTypes)}
      eyebrowType={getRandom(eyebrowTypes)}
      mouthType={getRandom(mouthTypes)}
      skinColor={getRandom(skinTypes)}
    />
  )
}

export default ImageData
