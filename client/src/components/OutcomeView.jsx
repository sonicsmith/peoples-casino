import React, { useState, useEffect } from "react"
import { Button, Heading, Text, RangeInput, TextInput, Box } from "grommet"
import SlotMachine from "./SlotMachine"

const OutcomeView = ({
  boxStyle,
  betOutcome,
  objectEmoji,
  subjectEmoji,
  goBack
}) => {
  if (betOutcome) {
    let outcomeMessage
    if (betOutcome.win) {
      outcomeMessage = `You won! Your winnings have been applied to your account.`
    } else {
      outcomeMessage = `You lost! Better luck next time!`
    }
    return (
      <Box {...boxStyle}>
        <Text size="xlarge">{`Bet is over!`}</Text>
        <SlotMachine
          objectEmoji={objectEmoji}
          subjectEmoji={subjectEmoji}
          win={betOutcome.win}
        />
        <Text size="medium">{outcomeMessage}</Text>
        <Box pad="medium">
          <Button label={"PLAY AGAIN"} primary onClick={goBack} />
        </Box>
      </Box>
    )
  }

  return (
    <Box {...boxStyle}>
      <Text size="xlarge">{`Bet is underway!`}</Text>
      <SlotMachine
        spinning={true}
        objectEmoji={objectEmoji}
        subjectEmoji={subjectEmoji}
      />
      <Text size="medium">Your results will be available soon...</Text>
    </Box>
  )
}

export default OutcomeView
