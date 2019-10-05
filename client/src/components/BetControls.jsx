import React, { useState, Fragment } from "react"
import { Button, Text, RangeInput, TextInput, Box } from "grommet"
import SlotMachine from "./SlotMachine"

const NUM_DP = 1000000
const ODDS_MIN = 2
const ODDS_MAX = 95

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

const BetControls = ({
  web3,
  betCommited,
  convertToWei,
  convertToEth,
  commitBet,
  getResult,
  houseReserve,
  subjectEmoji,
  objectEmoji
}) => {
  const [oddsPercentage, setOddsPercentage] = useState(ODDS_MAX)
  const maxBetAmount = convertToEth((houseReserve * oddsPercentage) / 96)
  const [betAmount, setBetAmount] = useState(roundDown(maxBetAmount / 2))
  const payout = ((betAmount * 96) / oddsPercentage).toFixed(18)
  const payoutInWei = convertToWei(payout)
  const payoutTooHigh = Number(payoutInWei) > Number(houseReserve)

  if (Number(houseReserve) > 0 || betCommited) {
    return (
      <Box {...MAIN_BOX_STYLE}>
        {betCommited && (
          <Text size="xlarge" weight="bold">
            BET COMMITTED
          </Text>
        )}
        <SlotMachine
          objectEmoji={objectEmoji}
          subjectEmoji={subjectEmoji}
          stopped={true}
        />
        {!betCommited && (
          <Fragment>
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
          </Fragment>
        )}
        {betCommited && (
          <Box align="center" margin="small">
            <Text>You must complete the bet within approx</Text>
            <Text>1 hour from start for your chance to win</Text>
          </Box>
        )}
        <Box>
          <Button
            // disabled={Number(betAmount) === 0}
            label={betCommited ? "SPIN" : "BET"}
            primary
            onClick={() => {
              if (!betCommited) {
                commitBet(betAmount, oddsPercentage)
              } else {
                getResult()
              }
            }}
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
