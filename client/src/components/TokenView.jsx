import React, { useState, useEffect } from "react"
import {
  Grommet,
  Button,
  Heading,
  Text,
  RangeInput,
  TextInput,
  Box
} from "grommet"
import { getTokenMetadata } from "./../tokenMetadata/getTokenMetadata"
import TokenImage from "./TokenImage"
import HouseBank from "./HouseBank"
import BetControls from "./BetControls"
import {
  makeBet,
  addToHouseReserve,
  subtractFromHouseReserve
} from "../utils/methods"

const useTokenMetadata = tokenId => {
  const [tokenMetadata, setTokenMetadata] = useState({})
  useEffect(() => {
    if (tokenId >= 0) {
      setTokenMetadata(getTokenMetadata(tokenId))
    }
  }, tokenId)
  return tokenMetadata
}

const notSold = [
  "0x0000000000000000000000000000000000000000"
  // "0xefDD4C11efD4df6F1173150e89102D343ae50AA4"
]
const getIsTokenAvailable = address => {
  return notSold.includes(address)
}

const TokenView = ({
  ownerOfToken,
  houseReserve,
  web3,
  contract,
  accounts,
  web3Error,
  tokenId
}) => {
  const [isManagingCasino, setIsManagingCasino] = useState(false)
  const tokenMetadata = useTokenMetadata(tokenId)

  const convertToWei = amount => {
    return web3.utils.toWei(String(amount), "ether")
  }

  const convertToEth = amount => {
    return web3.utils.fromWei(String(amount), "ether")
  }

  if (!web3) {
    if (web3Error) {
      return <div>ERROR: Cannot connect to web3</div>
    } else {
      return <div>Loading Web3, accounts, and contract...</div>
    }
  }

  const isTokenOwned = !getIsTokenAvailable(ownerOfToken)
  const { descriptionEmojis, imageAttributes } = tokenMetadata
  const { object: objectEmoji, subject: subjectEmoji } = descriptionEmojis
  let emojis = []
  for (let i = 0; i < 3; i++) {
    emojis = [...emojis, subjectEmoji, objectEmoji]
  }
  const tokenTheme = {
    global: {
      // font: { family: "Indie Flower" },
      colors: { ...imageAttributes.colorScheme, border: "black" }
    }
  }

  return (
    <Grommet plain theme={tokenTheme}>
      <Box align="center" background="background">
        <Box
          align="center"
          direction="column"
          border={{ color: "border", size: "large" }}
          pad="small"
          margin="medium"
          round={true}
          width="large"
          background="tokenBackground"
        >
          <Heading textAlign="center" level={2}>
            {tokenMetadata.name} (#{tokenId})
          </Heading>
          <Box width="medium">
            {tokenMetadata.description.map(line => {
              return (
                <Text textAlign="center" size="large" key={line}>
                  {line}
                </Text>
              )
            })}
          </Box>
          <Box>
            <Box pad="small">
              <TokenImage tokenId={tokenId} />
            </Box>
            <Box pad="small">
              <Text textAlign="center" size="xlarge">
                {emojis}
              </Text>
            </Box>
          </Box>
          {isTokenOwned && !isManagingCasino ? (
            <BetControls
              convertToWei={convertToWei}
              convertToEth={convertToEth}
              makeBet={(amount, oddsPercentage) => {
                makeBet({
                  web3,
                  contract,
                  accounts,
                  oddsPercentage,
                  betAmount: convertToWei(amount),
                  tokenId
                })
              }}
              houseReserve={houseReserve}
            />
          ) : (
            <Box>
              <Heading textAlign="center" level={3}>
                This token is unowned! Buy it in{" "}
                <a href="https://opensea.io/">OpenSea!</a>
              </Heading>
            </Box>
          )}
          {isManagingCasino && (
            <HouseBank
              convertToEth={convertToEth}
              houseReserve={houseReserve}
              addToHouseReserve={amount => {
                addToHouseReserve({ web3, contract, accounts, tokenId, amount })
              }}
              subtractFromHouseReserve={amount => {
                subtractFromHouseReserve({
                  web3,
                  contract,
                  accounts,
                  tokenId,
                  amount
                })
              }}
            />
          )}
          {ownerOfToken === accounts[0] && (
            <Box margin="medium">
              <Button
                label={isManagingCasino ? "BACK" : "MANAGE MY TOKEN"}
                primary
                onClick={() => setIsManagingCasino(!isManagingCasino)}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Grommet>
  )
}

export default TokenView
