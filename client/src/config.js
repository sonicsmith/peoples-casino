const getTokenId = () => {
  const url = window.location.href
  const regex = new RegExp("[?&]tokenId(=([^&#]*)|&|#|$)"),
    results = regex.exec(url)
  if (!results) return -1
  if (!results[2]) return -1
  return Number(decodeURIComponent(results[2].replace(/\+/g, " ")))
}

export const NETWORK_ID = 4
export const TOKEN_ID = getTokenId()
export const ASSIST_DAPP_ID = "c437fc37-df96-4cc0-ae0b-b7e694b7cc93"
