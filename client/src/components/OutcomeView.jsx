import React from "react"
import { Button, Text, Box } from "grommet"
import SlotMachine from "./SlotMachine"

const OutcomeView = ({
  boxStyle,
  betOutcome,
  objectEmoji,
  subjectEmoji,
  goBack
}) => {
  if (betOutcome) {
    const { roll, rollUnder } = betOutcome
    const win = roll <= rollUnder
    return (
      <Box {...boxStyle}>
        <Text size="xlarge" weight="bold">
          YOU {win ? "WON" : "LOST"}!
        </Text>
        <SlotMachine
          objectEmoji={objectEmoji}
          subjectEmoji={subjectEmoji}
          win={win}
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
