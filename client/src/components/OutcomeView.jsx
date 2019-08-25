import React, { useState } from "react"
import { Button, Heading, Text, RangeInput, TextInput, Box } from "grommet"

const getRandomEmojiGrid = (objectEmoji, subjectEmoji) => {
  const emojiGrid = []
  for (let x = 0; x < 10; x++) {
    const row = []
    for (let y = 0; y < 10; y++) {
      if (Math.random() > 0.5) {
        row.push(objectEmoji)
      } else {
        row.push(subjectEmoji)
      }
    }
    emojiGrid.push(row)
  }
}

const OutcomeView = ({ boxStyle, betOutcome, objectEmoji, subjectEmoji }) => {
  if (!betOutcome) {
    return <Box {...boxStyle}>BET IS HAPPENING</Box>
  }

  return <Box {...boxStyle}>We have an outcome: win {betOutcome.win}</Box>
}

export default OutcomeView
