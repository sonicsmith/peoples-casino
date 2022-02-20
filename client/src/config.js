export const ETH_NETWORK = 1
export const POLYGON_NETWORK = 137

export const getCurrencyCode = () => {
  if (getNetworkId() === ETH_NETWORK) {
    return "ETH"
  } else {
    return "MATIC"
  }
}

export const getNetworkId = () => {
  // For deprectate polygon network
  const isOldPOLYGON = window.location.href.includes("polygon-old")
  if (isOldPOLYGON) {
    return "polygonOld"
  }
  const isPOLYGON = window.location.href.includes("polygon")
  if (isPOLYGON) {
    return POLYGON_NETWORK
  }
  return ETH_NETWORK
}

export const CONTRACT_ADDRESSES = {
  1: "0x8995AD7dEaBd17c31b62AC89EE5f7D850a4BeDb0",
  3: "0x75e4687f1f45eE4982DB2B19CB25131efB2E20dA",
  4: "0x74Dfaa34F10580dAA4C081c4ad58aB3D6F4c6204",
  97: "0xd2c17A82ccD9FC59408f237c13819c49DEf4492C",
  //
  polygonOld: "0xC9473767d6f357B5A0B9A50a3A2cC67768c59e1F",
  137: "0xee1892d68d51187b2e3b05865bd8ad1210c3c718",
  //
  5777: "0xfc6dbd2f377895d19D32bBCE8404b3Aed5B0fC13",
}
export const ASSIST_DAPP_ID = "c437fc37-df96-4cc0-ae0b-b7e694b7cc93"
export const ownerAdddress = "0xefDD4C11efD4df6F1173150e89102D343ae50AA4"
export const noAddress = "0x0000000000000000000000000000000000000000"
