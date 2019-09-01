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
    const { win } = betOutcome
    return (
      <Box {...boxStyle}>
        <Text size="xlarge" weight="bold">
          YOU {win ? "WON" : "LOST"}!
        </Text>
        <SlotMachine
          objectEmoji={objectEmoji}
          subjectEmoji={subjectEmoji}
          win={betOutcome.win}
        />
        <Box width="medium">
          <Text size="medium" textAlign={"center"}>
            {win
              ? "Your winnings have been applied to your account."
              : "Better luck next time!"}
          </Text>
        </Box>
        <Box pad="medium">
          <Button label={"PLAY AGAIN"} primary onClick={goBack} />
        </Box>
      </Box>
    )
  }

  return (
    <Box {...boxStyle}>
      <Text size="xlarge" weight="bold">
        SPINNING!!
      </Text>
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
