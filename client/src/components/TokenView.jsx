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
import { TOKEN_ID } from "./../config"
import { getTokenMetadata } from "./../tokenMetadata/getTokenMetadata"
import ImageData from "./ImageData"
import HouseBank from "./HouseBank"
import BetControls from "./BetControls"
import {
  makeBet,
  addToHouseReserve,
  subtractFromHouseReserve
} from "../utils/methods"
import { titleCase } from "../utils/misc"

const useTokenMetadata = () => {
  const [tokenMetadata, setTokenMetadata] = useState({})
  useEffect(() => {
    if (TOKEN_ID >= 0) {
      setTokenMetadata(getTokenMetadata(TOKEN_ID))
    }
  }, TOKEN_ID)
  return tokenMetadata
}

const noAddress = "0x0000000000000000000000000000000000000000"
const getIsTokenOwned = address => {
  return address !== noAddress
}

const TokenView = ({
  ownerOfToken,
  houseReserve,
  web3,
  accounts,
  web3Error
}) => {
  const [oddsPercentage, setOddsPercentage] = useState(50)
  const [betAmount, setBetAmount] = useState(1)
  const [isManagingCasino, setIsManagingCasino] = useState(false)
  const tokenMetadata = useTokenMetadata(TOKEN_ID)

  const convertToWei = amount => {
    return web3.utils.toWei(amount.toString(), "ether")
  }

  if (!web3) {
    if (web3Error) {
      return <div>ERROR: Cannot connect to web3</div>
    } else {
      return <div>Loading Web3, accounts, and contract...</div>
    }
  }

  const isTokenOwned = getIsTokenOwned(ownerOfToken)
  const { descriptionEmojis, imageAttributes } = tokenMetadata
  const { object: objectEmoji, subject: subjectEmoji } = descriptionEmojis
  const objectEmojis = []
  for (let i = 0; i < 6; i++) {
    objectEmojis.push(objectEmoji)
  }
  const subjectEmojis = []
  for (let i = 0; i < 6; i++) {
    subjectEmojis.push(subjectEmoji)
  }
  const tokenTheme = {
    global: { colors: { ...imageAttributes.colorScheme } }
  }
  console.log(tokenTheme)
  return (
    <Grommet plain theme={tokenTheme}>
      <Box align="center">
        <Box
          align="center"
          direction="column"
          border={{ color: "border", size: "large" }}
          pad="small"
          margin="medium"
          round={true}
          width="large"
          background="background"
        >
          <Heading textAlign="center" level={2}>
            {titleCase(tokenMetadata.name)} (#{TOKEN_ID})
          </Heading>
          <Box width="medium">
            {tokenMetadata.description.map(line => {
              return (
                <Text textAlign="center" key={line}>
                  {line}
                </Text>
              )
            })}
          </Box>
          <Box>
            <Box pad="small">
              <Text textAlign="center" size="xlarge">
                {objectEmojis}
              </Text>
            </Box>
            <ImageData imageAttributes={tokenMetadata.imageAttributes} />
            <Box pad="small">
              <Text textAlign="center" size="xlarge">
                {subjectEmojis}
              </Text>
            </Box>
          </Box>
          {isTokenOwned ? (
            <BetControls
              convertToWei={convertToWei}
              oddsPercentage={oddsPercentage}
              setOddsPercentage={setOddsPercentage}
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              makeBet={makeBet}
            />
          ) : (
            <Box>
              <Heading textAlign="center" level={3}>
                This token is unowned! Buy it in{" "}
                <a href="https://opensea.io/">OpenSea!</a>
              </Heading>
            </Box>
          )}
          {ownerOfToken === accounts[0] && (
            <Button
              label={isManagingCasino ? "CLOSE" : "MANAGE MY TOKEN"}
              primary
              onClick={() => setIsManagingCasino(!isManagingCasino)}
            />
          )}
          {isManagingCasino && (
            <HouseBank
              addToHouseReserve={addToHouseReserve}
              subtractFromHouseReserve={subtractFromHouseReserve}
            />
          )}
        </Box>
      </Box>
    </Grommet>
  )
}

export default TokenView
