import { getAPITokenMetadata } from "./../tokenMetadata/getTokenMetadata"

exports.handler = function(event, context, callback) {
  const tokenId = event.path.substring(5)
  const metaData = getAPITokenMetadata(`${tokenId}`)
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(metaData)
  })
}
