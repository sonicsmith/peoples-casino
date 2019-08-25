import React, { useState } from "react"
import {
  Grommet,
  Button,
  Heading,
  Text,
  RangeInput,
  TextInput,
  Box
} from "grommet"

const NUM_DP = 10000
const ODDS_MIN = 1
const ODDS_MAX = 97

const round = amount => {
  return Math.round(amount * NUM_DP) / NUM_DP
}

const roundDown = amount => {
  return Math.floor(amount * NUM_DP) / NUM_DP
}

const MAIN_BOX_STYLE = {
  align: "center",
  direction: "column",
  border: { color: "border", size: "large" },
  margin: "medium",
  pad: "medium",
  round: true,
  background: "white"
}

const BetControls = ({ convertToWei, convertToEth, makeBet, houseReserve }) => {
  const [oddsPercentage, setOddsPercentage] = useState(ODDS_MAX)
  const maxBetAmount = convertToEth((houseReserve * oddsPercentage) / 99)
  const [betAmount, setBetAmount] = useState(roundDown(maxBetAmount))
  const payout = (betAmount * 99) / oddsPercentage
  const payoutInWei = convertToWei(payout)
  const payoutTooHigh = Number(payoutInWei) > Number(houseReserve)
  if (Number(houseReserve) > 0) {
    return (
      <Box {...MAIN_BOX_STYLE}>
        <Box align="center">
          <Text level={5}>WIN CHANCE {oddsPercentage}%</Text>
        </Box>
        <Box margin="medium" width="medium">
          <RangeInput
            min={ODDS_MIN}
            max={ODDS_MAX}
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
          margin="medium"
          style={payoutTooHigh ? { color: "red" } : {}}
        >
          <Text>PAYOUT {round(payout)} ETH</Text>
          {payoutTooHigh && (
            <Text>Casino not backed for a wager that high!</Text>
          )}
        </Box>
        <Box>
          <Button
            disabled={Number(betAmount) === 0}
            label={"BET"}
            primary
            onClick={() => makeBet(betAmount, oddsPercentage)}
          />
        </Box>
      </Box>
    )
  } else {
    return (
      <Box {...MAIN_BOX_STYLE}>
        <Text>Casino is currently dry!</Text>
        <Text>Please check back soon</Text>
      </Box>
    )
  }
}

export default BetControls
