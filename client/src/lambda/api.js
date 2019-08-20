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

exports.handler = function(event, context, callback) {
  const tokenId = event.path.substring(5)
  const metaData = getAPITokenMetadata(`${tokenId}`)
  metaData.image_raw = getRawSvg(tokenId)
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(metaData)
  })
}
