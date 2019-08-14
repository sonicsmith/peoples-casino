import { getTokenMetadata } from "./tokenMetadata/getTokenMetadata"

const Api = ({ tokenId }) => {
  const tokenMetadata = getTokenMetadata(tokenId)
  // TODO: Remove the attributes we don't need
  // tokenMetadata.image_data = <ImageData tokenId={tokenId} /> // TODO: Stringify svg
  return JSON.stringify(tokenMetadata)
}

export default Api
