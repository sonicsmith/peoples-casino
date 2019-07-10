const getNetwork = () => {
  return Number("5777")
  const url = window.location.href
  const regex = new RegExp("[?&]network(=([^&#]*)|&|#|$)"),
    results = regex.exec(url)
  if (!results) return 1
  if (!results[2]) return 1
  return Number(decodeURIComponent(results[2].replace(/\+/g, " ")))
}

const getTokenId = () => {
  return Number("1")
  const url = window.location.href
  const regex = new RegExp("[?&]tokenId(=([^&#]*)|&|#|$)"),
    results = regex.exec(url)
  if (!results) return 1
  if (!results[2]) return 1
  return Number(decodeURIComponent(results[2].replace(/\+/g, " ")))
}

export const NETWORK_ID = getNetwork()
export const TOKEN_ID = getTokenId()
export const ASSIST_DAPP_ID = "3ffaf8a8-c2b0-47cd-8773-307f1427d40a"
