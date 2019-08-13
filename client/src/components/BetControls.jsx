import React from "react"
import {
  Grommet,
  Button,
  Heading,
  Text,
  RangeInput,
  TextInput,
  Box
} from "grommet"

const round = amount => {
  return Math.round(amount * 1000) / 1000
}

const BetControls = ({
  convertToWei,
  oddsPercentage,
  setOddsPercentage,
  betAmount,
  setBetAmount,
  makeBet,
  houseReserve
}) => {
  const payout = (betAmount * 99) / oddsPercentage
  const payoutInWei = convertToWei(payout)
  const payoutTooHigh = Number(payoutInWei) > Number(houseReserve)
  return (
    <Box align="center">
      <Box
        align="center"
        direction="column"
        border={{ color: "border", size: "large" }}
        margin="medium"
        pad="medium"
        round={true}
        background="white"
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
        <Box align="center" style={payoutTooHigh ? { color: "red" } : {}}>
          <Text>PAYOUT {round(payout)} ETH</Text>
          {payoutTooHigh && (
            <Text>Not enough money in the house for a wager that high!</Text>
          )}
        </Box>
      </Box>
      <Button label={"BET"} primary onClick={makeBet} />
    </Box>
  )
}

export default BetControls
