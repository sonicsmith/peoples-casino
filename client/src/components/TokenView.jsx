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
import { HouseBank } from "./HouseBank"
import {
  makeBet,
  addToHouseReserve,
  subtractFromHouseReserve
} from "../utils/methods"

const useTokenMetadata = () => {
  const [tokenMetadata, setTokenMetadata] = useState({})
  useEffect(() => {
    if (TOKEN_ID >= 0) {
      setTokenMetadata(getTokenMetadata(TOKEN_ID))
    }
  }, TOKEN_ID)
  return tokenMetadata
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

  if (!web3) {
    if (web3Error) {
      return <div>ERROR: Cannot connect to web3</div>
    } else {
      return <div>Loading Web3, accounts, and contract...</div>
    }
  }

  const payout = (betAmount * 99) / oddsPercentage
  const payoutInWei = web3.utils.toWei(payout.toString(), "ether")
  const payoutTooHigh = Number(payoutInWei) > Number(houseReserve)

  return (
    <Grommet plain>
      <Box align="center">
        <Box
          align="center"
          direction="column"
          border={{ color: "brand", size: "large" }}
          pad="medium"
          margin="medium"
          round={true}
          width="large"
        >
          <Heading textAlign="center" level={2}>
            {tokenMetadata.name}
          </Heading>
          <Box width="medium">
            <Text textAlign="center">{tokenMetadata.description}</Text>
          </Box>
          <Box>
            <ImageData imageAttributes={tokenMetadata.imageAttributes} />
            {tokenMetadata.descriptionEmojis.object}
          </Box>
          <Box
            align="center"
            direction="column"
            border={{ color: "brand", size: "medium" }}
            margin="medium"
            pad="medium"
            round={true}
          >
            <Box align="center">
              <Text level={5}>WIN CHANCE {oddsPercentage}%</Text>
            </Box>
            <Box margin="medium" width="medium">
              <RangeInput
                min={1}
                max={97}
                value={oddsPercentage}
                onChange={event => setOddsPercentage(event.target.value)}
              />
            </Box>
            <Text>BET AMOUNT {betAmount} ETH</Text>
            <Box margin="medium">
              <TextInput
                type="number"
                value={betAmount}
                onChange={event => setBetAmount(event.target.value)}
              />
            </Box>
            <Box
              align="center"
              style={{ color: payoutTooHigh ? "red" : "black" }}
            >
              <Text>PAYOUT {payout} ETH</Text>
              {payoutTooHigh && (
                <Text>
                  Not enough money in the house for a wager that high!
                </Text>
              )}
            </Box>
          </Box>
          <Button label={"BET"} primary onClick={makeBet} />
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
