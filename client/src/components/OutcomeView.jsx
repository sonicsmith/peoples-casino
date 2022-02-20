import React, { useEffect, useState } from "react"
import { Button, Text, Box } from "grommet"
import SlotMachine from "./SlotMachine"
import { getNetworkId, ETH_NETWORK } from "./../config"

const getProofLink = (transactionHash) => {
  if (getNetworkId() === ETH_NETWORK) {
    return `https://etherscan.io/tx/${transactionHash}#eventlog`
  }
  return `https://polygonscan.com/tx/${transactionHash}#eventlog`
}

const OutcomeView = ({
  boxStyle,
  betOutcome,
  objectEmoji,
  subjectEmoji,
  goBack,
}) => {
  const [shouldDisplayText, setShouldDisplayText] = useState(false)
  useEffect(() => {
    if (betOutcome) {
      const displayResultText = setTimeout(() => {
        setShouldDisplayText(true)
      }, 6000)
      return () => clearTimeout(displayResultText)
    }
  }, [betOutcome])

  if (betOutcome) {
    const { random, oddsPercentage, transactionHash } = betOutcome
    const win = Number(random) <= Number(oddsPercentage)

    return (
      <Box {...boxStyle}>
        {shouldDisplayText && (
          <Text size="xlarge" weight="bold">
            YOU {win ? "WON" : "LOST"}!
          </Text>
        )}
        <SlotMachine
          objectEmoji={objectEmoji}
          subjectEmoji={subjectEmoji}
          win={win}
        />
        <Box width="medium">
          {shouldDisplayText && (
            <Text size="medium" textAlign={"center"}>
              {win
                ? "Your winnings have been applied to your account."
                : "Better luck next time!"}
            </Text>
          )}
          <Text size="small" textAlign={"center"}>
            <a
              href={getProofLink(transactionHash)}
              target="_blank"
              rel="noopener noreferrer"
            >
              PROVABLE FAIRNESS
            </a>
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
