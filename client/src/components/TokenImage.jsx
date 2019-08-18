import React from "react"
import Avatar from "avataaars"
import { getImageAttributes } from "./../tokenMetadata/getTokenMetadata"
import jsxToString from "jsx-to-string"

const TokenImage = ({ tokenId }) => {
  const imageAttributes = getImageAttributes(tokenId)
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

// export const getSvgString = tokenId => {
//   return jsxToString(<TokenImage tokenId={tokenId} />)
// }

export default TokenImage
