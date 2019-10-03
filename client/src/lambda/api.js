import React from "react"
import RDS from "react-dom/server"
import {
  getAPITokenMetadata,
  getImageAttributes
} from "./../tokenMetadata/getTokenMetadata.js"
import Avatar from "avataaars"

const getRawSvg = tokenId => {
  const imageAttributes = getImageAttributes(tokenId)
  return RDS.renderToString(
    <Avatar
      // avatarStyle="Circle"
      topType={imageAttributes.topTypes}
      accessoriesType={imageAttributes.accessoriesTypes}
      hairColor={imageAttributes.hairColors}
      facialHairType={imageAttributes.facialHairTypes}
      clotheType={imageAttributes.clotheTypes}
      clotheColor={imageAttributes.clotheColors}
      eyeType={imageAttributes.eyeTypes}
      eyebrowType={imageAttributes.eyebrowTypes}
      mouthType={imageAttributes.mouthTypes}
      skinColor={imageAttributes.skinTypes}
    />
  )
}

exports.handler = async event => {
  const lastSlash = event.path.lastIndexOf("/")
  const tokenId = event.path.substring(lastSlash + 1)
  const image_data = getRawSvg(tokenId)
  return getAPITokenMetadata(tokenId)
    .then(metaData => {
      return {
        statusCode: 200,
        body: JSON.stringify({ ...metaData, image_data })
      }
    })
    .catch(e => new Error(e))
}
