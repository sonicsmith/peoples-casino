import React, { useState, useEffect } from "react"
import { Grommet, Button, Heading, Text, Box } from "grommet"
import { getIsTokenForSale } from "./../utils/misc"
import { getTokenMetadata } from "./../tokenMetadata/getTokenMetadata"
import TokenImage from "./TokenImage"
import HouseBank from "./HouseBank"
import BetControls from "./BetControls"
import OutcomeView from "./OutcomeView"
import {
  commitBet,
  getResult,
  depositHouseReserve,
  withdrawalHouseReserve,
  forceUpdateMetadata,
} from "../utils/methods"
import NoToken from "./NoToken"
import { getNetworkId, CONTRACT_ADDRESSES, POLYGON_NETWORK } from "../config"

const MAIN_BOX_STYLE = {
  align: "center",
  direction: "column",
  border: { color: "border", size: "large" },
  margin: "medium",
  pad: "medium",
  size: "small",
  round: true,
  background: "white",
}

const WAITING_FOR_BET = 0
const WAITING_FOR_SPIN = 1
const WAITING_FOR_RESULT = 2

const TokenView = ({
  ownerOfToken,
  houseReserve,
  ongoingBetSender,
  refreshData,
  web3,
  contract,
  accounts,
  web3Error,
  tokenId,
  setNotificationEventListener,
}) => {
  const [isManagingCasino, setIsManagingCasino] = useState(false)
  const tokenMetadata = getTokenMetadata(tokenId)
  const [betState, setBetState] = useState(
    ongoingBetSender === accounts[0] ? WAITING_FOR_SPIN : WAITING_FOR_BET
  )
  const [betOutcome, setBetOutcome] = useState()

  useEffect(() => {
    setNotificationEventListener(({ eventCode, contract: { methodName } }) => {
      console.log("eventCode", eventCode, methodName)
      if (eventCode === "txConfirmed" || eventCode === "txConfirmedClient") {
        if (methodName === "commitBet") {
          setBetState(WAITING_FOR_SPIN)
        }
        if (methodName === "getResult") {
          setBetState(WAITING_FOR_RESULT)
        }
      }
      if (eventCode === "txError") {
        if (methodName === "commitBet") {
          setBetState(WAITING_FOR_BET)
        }
        if (methodName === "getResult") {
          setBetState(WAITING_FOR_SPIN)
        }
      }
      return true
    })
  }, [])

  const convertToWei = (amount) => {
    return web3.utils.toWei(String(amount), "ether")
  }

  const convertToEth = (amount) => {
    return web3.utils.fromWei(String(Math.floor(amount)), "ether")
  }

  // If we can't connect to web3, or find the token
  if (!web3) {
    return <NoToken loading={!web3Error} web3Error={web3Error} />
  }

  const tokenForSale = getIsTokenForSale(tokenId, ownerOfToken)
  const { descriptionItems, imageAttributes } = tokenMetadata
  const { object: objectItem, subject: subjectItem } = descriptionItems
  const objectEmoji = objectItem.emoji
  const subjectEmoji = subjectItem.emoji
  const subjectName = subjectItem.name

  const tokenTheme = {
    global: {
      colors: { ...imageAttributes.colorScheme, border: "black" },
    },
  }

  const networkId = getNetworkId()
  const contractAddress = CONTRACT_ADDRESSES[networkId]
  const blockchain = networkId === POLYGON_NETWORK ? "matic/" : ""
  const linkExt = networkId === POLYGON_NETWORK ? "-polygon" : ""

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
              {tokenMetadata.description.map((line) => {
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
                  href={`https://opensea.io/assets/${blockchain}${contractAddress}/${tokenId}`}
                >
                  OpenSea!
                </a>
              </Heading>
            </Box>
          )}
          {/* BET CONTROLS */}
          {!tokenForSale &&
            !isManagingCasino &&
            betState !== WAITING_FOR_RESULT && (
              <BetControls
                web3={web3}
                betCommited={betState === WAITING_FOR_SPIN}
                objectEmoji={objectEmoji}
                subjectEmoji={subjectEmoji}
                boxStyle={MAIN_BOX_STYLE}
                convertToWei={convertToWei}
                convertToEth={convertToEth}
                commitBet={(amount, oddsPercentage) => {
                  commitBet({
                    web3,
                    contract,
                    accounts,
                    oddsPercentage,
                    betAmount: convertToWei(amount),
                    tokenId,
                  }).then((result) => {
                    console.log("Commit Bet", result)
                  })
                }}
                getResult={() => {
                  getResult({
                    web3,
                    contract,
                    accounts,
                    tokenId,
                  }).then((outcome) => {
                    const { err, cancelled } = outcome
                    console.log("outcome", outcome)
                    if (!err && !cancelled) {
                      setBetOutcome(outcome)
                      forceUpdateMetadata(tokenId)
                    }
                  })
                }}
                houseReserve={houseReserve}
              />
            )}
          {/* BET OUTCOME */}
          {betState === WAITING_FOR_RESULT && (
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
              depositHouseReserve={(amount) => {
                depositHouseReserve({
                  web3,
                  contract,
                  accounts,
                  tokenId,
                  amount,
                }).then((success) => {
                  if (success) {
                    refreshData()
                    forceUpdateMetadata(tokenId)
                  }
                })
              }}
              withdrawalHouseReserve={(amount) => {
                withdrawalHouseReserve({
                  web3,
                  contract,
                  accounts,
                  tokenId,
                  amount,
                }).then((success) => {
                  if (success) {
                    refreshData()
                    forceUpdateMetadata(tokenId)
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
            href={`https://opensea.io/collection/peoplescasino${linkExt}`}
            title="Buy on OpenSea"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              style={{
                width: "220",
                borderRadius: 5,
                boxShadow: "0px 1px 6px rgba(0, 0, 0, 0.25)",
              }}
              src="https://storage.googleapis.com/opensea-static/Logomark/Badge%20-%20Available%20On%20-%20Light.png"
              alt="Available on OpenSea"
            />
          </a>
        </Box>
      </Box>
    </Grommet>
  )
}

export default TokenView
