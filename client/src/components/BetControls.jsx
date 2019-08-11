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
    <div>
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
        <Box align="center" style={{ color: payoutTooHigh ? "red" : "black" }}>
          <Text>PAYOUT {payout} ETH</Text>
          {payoutTooHigh && (
            <Text>Not enough money in the house for a wager that high!</Text>
          )}
        </Box>
      </Box>
      <Button label={"BET"} primary onClick={makeBet} />
    </div>
  )
}

export default BetControls
