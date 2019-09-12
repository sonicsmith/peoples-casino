import React, { useState, useEffect } from "react"
import { Grommet, Button, Heading, Text, Box, Grid } from "grommet"
import { getIsTokenForSale } from "./../utils/misc"
import { getTokenMetadata } from "./../tokenMetadata/getTokenMetadata"
import TokenImage from "./TokenImage"
import HouseBank from "./HouseBank"
import BetControls from "./BetControls"
import OutcomeView from "./OutcomeView"
import {
  makeBet,
  depositHouseReserve,
  withdrawalHouseReserve
} from "../utils/methods"
import NoToken from "./NoToken"

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
    return web3.utils.fromWei(String(Math.floor(amount)), "ether")
  }

  // If we can't connect to web3, or find the token
  if (!web3) {
    return <NoToken loading={!web3Error} web3Error={web3Error} />
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
          <Box align="center">
            <Box pad="small">
              <TokenImage tokenId={tokenId} />
            </Box>
            <Box width="medium">
              {tokenMetadata.description.map(line => {
                return (
                  <Text textAlign="center" size="large" key={line}>
                    {line}
                  </Text>
                )
              })}
            </Box>
          </Box>
          {/* NO OWNER */}
          {tokenForSale && (
            <Box>
              <Heading textAlign="center" level={3}>
                This token is unowned! Buy it in{" "}
                <a
                  href={`https://opensea.io/assets/0xFEC783E2B297b69118A60267229dDE03012162A4/${tokenId}`}
                >
                  OpenSea!
                </a>
              </Heading>
            </Box>
          )}
          {/* BET CONTROLS */}
          {!tokenForSale && !isManagingCasino && betState === WAITING_FOR_BET && (
            <BetControls
              objectEmoji={objectEmoji}
              subjectEmoji={subjectEmoji}
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
              depositHouseReserve={amount => {
                depositHouseReserve({
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
              withdrawalHouseReserve={amount => {
                withdrawalHouseReserve({
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
        <Box>
          <Text textAlign="center" weight="bold">
            Want to own your own casino?! Check out our store on OpenSea:
          </Text>
        </Box>
        <Box align="center" margin="medium">
          <a
            href="https://opensea.io/assets/peoplescasino"
            title="Buy on OpenSea"
            target="_blank"
          >
            <img
              style={{
                width: 160,
                borderRadius: 5,
                boxShadow: "0px 1px 6px rgba(0, 0, 0, 0.25)"
              }}
              src="https://storage.googleapis.com/opensea-static/opensea-brand/buy-button-white.png"
              alt="Buy on OpenSea badge"
            />
          </a>
        </Box>
      </Box>
    </Grommet>
  )
}

export default TokenView
