import React from "react"
import Avatar from "avataaars"
import { getImageAttributes } from "./../tokenMetadata/getTokenMetadata"

const TokenImage = ({ tokenId }) => {
  const imageAttributes = getImageAttributes(tokenId)
  console.log(tokenId, typeof tokenId)
  return (
    <Avatar
      avatarStyle="Circle"
      topType={imageAttributes.topTypes}
      accessoriesType={imageAttributes.accessoriesTypes}
      hairColor={imageAttributes.hairColors}
      facialHairType={imageAttributes.facialHairTypes}
      clotheType={imageAttributes.clotheTypes}
      eyeType={imageAttributes.eyeTypes}
      eyebrowType={imageAttributes.eyebrowTypes}
      mouthType={imageAttributes.mouthTypes}
      skinColor={imageAttributes.skinTypes}
    />
  )
}

export default TokenImage
