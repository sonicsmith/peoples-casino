import React, { useState, useEffect } from "react"
import {
  Grommet,
  Button,
  Heading,
  Text,
  RangeInput,
  TextInput,
  Box
} from "grommet"
import { ownerAdddress } from "./../config"
import { getIsTokenForSale, getIsTokenMinted } from "./../utils/misc"
import { getTokenMetadata } from "./../tokenMetadata/getTokenMetadata"
import TokenImage from "./TokenImage"
import HouseBank from "./HouseBank"
import BetControls from "./BetControls"
import OutcomeView from "./OutcomeView"
import {
  makeBet,
  addToHouseReserve,
  subtractFromHouseReserve
} from "../utils/methods"
import SlotMachine from "./SlotMachine"

const MAIN_BOX_STYLE = {
  align: "center",
  direction: "column",
  border: { color: "border", size: "large" },
  margin: "medium",
  pad: "medium",
  round: true,
  background: "white"
}

const WAITING_FOR_BET = 0
const WAITING_FOR_RESULT = 1
const DISPLAYING_RESULT = 2

const TokenView = ({
  ownerOfToken,
  houseReserve,
  refreshData,
  web3,
  contract,
  accounts,
  web3Error,
  tokenId,
  setNotificationEventListener
}) => {
  const [isManagingCasino, setIsManagingCasino] = useState(false)
  const tokenMetadata = getTokenMetadata(tokenId)
  const [betState, setBetState] = useState(WAITING_FOR_BET)
  const [betOutcome, setBetOutcome] = useState()

  useEffect(() => {
    setNotificationEventListener(({ eventCode, contract }) => {
      console.log("eventCode", eventCode, contract.methodName)
      if (contract.methodName === "makeBet") {
        if (eventCode === "txSent") {
          setBetState(WAITING_FOR_RESULT)
        }
      }
      return true
    })
  }, [])

  const convertToWei = amount => {
    return web3.utils.toWei(String(amount), "ether")
  }

  const convertToEth = amount => {
    return web3.utils.fromWei(String(amount), "ether")
  }

  if (!web3) {
    if (web3Error) {
      return <div>ERROR: Cannot connect to web3</div>
    } else {
      return <div>Loading Web3, accounts, and contract...</div>
    }
  }

  const tokenForSale = getIsTokenForSale(ownerOfToken)
  const { descriptionItems, imageAttributes } = tokenMetadata
  const { object: objectItem, subject: subjectItem } = descriptionItems
  const objectEmoji = objectItem.emoji
  const subjectEmoji = subjectItem.emoji
  const subjectName = subjectItem.name

  let emojis = []
  for (let i = 0; i < 4; i++) {
    emojis = [...emojis, objectEmoji, subjectEmoji]
  }
  emojis.pop()
  const tokenTheme = {
    global: {
      // font: { family: "Indie Flower" },
      colors: { ...imageAttributes.colorScheme, border: "black" }
    }
  }

  return (
    <Grommet plain theme={tokenTheme}>
      <Box align="center" background="background">
        <Box
          align="center"
          direction="column"
          border={{ color: "border", size: "large" }}
          pad="small"
          margin="medium"
          round={true}
          width="large"
          background="tokenBackground"
        >
          {/* TOKEN */}
          <Heading textAlign="center" level={2}>
            {tokenMetadata.name} (#{tokenId})
          </Heading>
          <Box width="medium">
            {tokenMetadata.description.map(line => {
              return (
                <Text textAlign="center" size="large" key={line}>
                  {line}
                </Text>
              )
            })}
          </Box>
          <Box>
            <Box pad="small">
              <TokenImage tokenId={tokenId} />
            </Box>
            <Box pad="small">
              {/* <Text textAlign="center" size="xlarge">
                {emojis}
              </Text> */}
              {/* <SlotMachine
                objectEmoji={objectEmoji}
                subjectEmoji={subjectEmoji}
                win={false}
              /> */}
            </Box>
          </Box>
          {/* NO OWNER */}
          {tokenForSale && (
            <Box>
              <Heading textAlign="center" level={3}>
                This token is unowned! Buy it in{" "}
                <a href="https://opensea.io/">OpenSea!</a>
              </Heading>
            </Box>
          )}
          {/* BET CONTROLS */}
          {!tokenForSale && !isManagingCasino && betState === WAITING_FOR_BET && (
            <BetControls
              boxStyle={MAIN_BOX_STYLE}
              convertToWei={convertToWei}
              convertToEth={convertToEth}
              makeBet={(amount, oddsPercentage) => {
                makeBet({
                  web3,
                  contract,
                  accounts,
                  oddsPercentage,
                  betAmount: convertToWei(amount),
                  tokenId
                }).then(outcome => {
                  const { err, cancelled } = outcome
                  console.log("outcome", outcome)
                  if (!err && !cancelled) {
                    setBetOutcome(outcome)
                  } else {
                    setBetState(WAITING_FOR_BET)
                  }
                })
              }}
              houseReserve={houseReserve}
            />
          )}
          {/* BET OUTCOME */}
          {betState !== WAITING_FOR_BET && (
            <OutcomeView
              boxStyle={MAIN_BOX_STYLE}
              betOutcome={betOutcome}
              objectEmoji={objectEmoji}
              subjectEmoji={subjectEmoji}
              subjectName={subjectName}
              goBack={() => setBetState(WAITING_FOR_BET)}
            />
          )}
          {/* TOKEN MANAGEMENT */}
          {isManagingCasino && (
            <HouseBank
              boxStyle={MAIN_BOX_STYLE}
              convertToEth={convertToEth}
              houseReserve={houseReserve}
              addToHouseReserve={amount => {
                addToHouseReserve({
                  web3,
                  contract,
                  accounts,
                  tokenId,
                  amount
                }).then(success => {
                  if (success) {
                    refreshData()
                  }
                })
              }}
              subtractFromHouseReserve={amount => {
                subtractFromHouseReserve({
                  web3,
                  contract,
                  accounts,
                  tokenId,
                  amount
                }).then(success => {
                  if (success) {
                    refreshData()
                  }
                })
              }}
            />
          )}
          {ownerOfToken === accounts[0] && (
            <Box margin="medium">
              <Button
                label={isManagingCasino ? "BACK" : "MANAGE MY TOKEN"}
                primary
                onClick={() => setIsManagingCasino(!isManagingCasino)}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Grommet>
  )
}

export default TokenView
