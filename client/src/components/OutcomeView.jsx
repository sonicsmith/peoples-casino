import React, { useState, useEffect } from "react"
import { Button, Heading, Text, RangeInput, TextInput, Box } from "grommet"

const EmojiGrid = ({ objectEmoji, subjectEmoji }) => {
  const emojiGrid = []
  for (let y = 0; y < 8; y++) {
    const randomEmoji = Math.random() > 0.5 ? objectEmoji : subjectEmoji
    emojiGrid.push(randomEmoji)
  }
  return <Text size="xlarge">{emojiGrid}</Text>
}

const OutcomeView = ({
  boxStyle,
  betOutcome,
  objectEmoji,
  subjectEmoji,
  subjectName,
  goBack
}) => {
  const [random, setRandom] = useState()

  const shouldAnimate = () => {
    return !betOutcome
  }

  useEffect(() => {
    const changeRandom = () => {
      setTimeout(() => {
        setRandom(Math.random())
        if (shouldAnimate()) {
          changeRandom()
        }
      }, 100)
    }
    changeRandom()
  }, [])

  if (betOutcome) {
    let outcomeMessage
    const emoji = betOutcome.win ? subjectEmoji : objectEmoji
    if (betOutcome.win) {
      outcomeMessage = [
        `You won! You found enough ${subjectName}.`,
        `Your winnings have been applied to your account.`
      ]
    } else {
      outcomeMessage = [
        `You lost! You didn't find enough ${subjectName}.`,
        `Better luck next time!`
      ]
    }
    return (
      <Box {...boxStyle}>
        <Text size="xlarge">{`Bet is over!`}</Text>
        <Box pad="medium">
          <EmojiGrid objectEmoji={emoji} subjectEmoji={emoji} />
        </Box>
        {outcomeMessage.map(msg => (
          <Text size="medium">{msg}</Text>
        ))}
        <Box pad="medium">
          <Button label={"PLAY AGAIN"} primary onClick={goBack} />
        </Box>
      </Box>
    )
  }

  return (
    <Box {...boxStyle}>
      <Text size="xlarge">{`Bet is underway!`}</Text>
      <Box pad="medium">
        <EmojiGrid
          random={random}
          objectEmoji={objectEmoji}
          subjectEmoji={subjectEmoji}
        />
      </Box>
      <Text size="medium">Your results will be available soon...</Text>
    </Box>
  )
}

export default OutcomeView
