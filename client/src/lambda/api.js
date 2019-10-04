import React from "react"
import RDS from "react-dom/server"
import {
  getAPITokenMetadata,
  getImageAttributes
} from "./../tokenMetadata/getTokenMetadata.js"
import Avatar from "avataaars"
import Web3 from "web3"
import HDWalletProvider from "truffle-hdwallet-provider"
import { CONTRACT_ADDRESSES } from "../config"
import ContractJson from "./../contracts/PeoplesCasino.json"

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

const getCasinoHoldings = tokenId => {
  // No need to hide, this is a throwaway address
  const MNEMONIC =
    "oil disagree hunt blush insane lift spare law news moon wonder ugly"
  const INFURA_KEY = "18959c54058e4101bc4edfefa4134bb3"
  const provider = new HDWalletProvider(
    MNEMONIC,
    `https://mainnet.infura.io/v3/${INFURA_KEY}`
  )
  const web3Instance = new Web3(provider)
  const contract = new web3Instance.eth.Contract(
    ContractJson.abi,
    CONTRACT_ADDRESSES[1],
    { gasLimit: "1000000" }
  )
  return contract.methods
    .getHouseReserve(tokenId)
    .call()
    .then(amount => {
      const ethAmount = web3Instance.utils.fromWei(String(amount), "ether")
      return Math.floor(ethAmount * 100000) / 100000
    })
}

exports.handler = async event => {
  const lastSlash = event.path.lastIndexOf("/")
  const tokenId = event.path.substring(lastSlash + 1)
  const image_data = getRawSvg(tokenId)
  const metaData = getAPITokenMetadata(tokenId)
  return getCasinoHoldings(tokenId)
    .then(value => {
      const prizePool = {
        display_type: "number",
        trait_type: "Prize Pool (ETH)",
        value
      }
      metaData.attributes.push(prizePool)
      return {
        statusCode: 200,
        body: JSON.stringify({ ...metaData, image_data })
      }
    })
    .catch(e => new Error(e))
}
