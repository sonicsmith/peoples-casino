import React, { Component } from "react"
import {
  Grommet,
  Button,
  Heading,
  Text,
  RangeInput,
  TextInput,
  Box
} from "grommet"
import { TOKEN_ID } from "./../config"
import { getTokenMetadata } from "./../tokenMetadata/getTokenMetadata"
import ImageData from "./ImageData"
import { HouseBank } from "./HouseBank"

class Main extends Component {
  state = {
    oddsPercentage: 50,
    betAmount: 1,
    tokenMetadata: {}
  }

  componentDidMount = () => {
    this.setState({ tokenMetadata: getTokenMetadata(TOKEN_ID) })
  }

  refresh = async () => {
    const { contract, web3 } = this.props
    if (contract) {
      const { methods } = contract
      console.log("contract", contract)
      const houseReserve = await methods.getHouseReserve(TOKEN_ID).call()
      const ownerOfToken = await methods.ownerOf(TOKEN_ID).call()
      console.log("houseReserve:", houseReserve)
      console.log("ownerOfToken:", ownerOfToken)
      const betAmount = web3.utils.fromWei(
        (houseReserve / 2).toString(),
        "ether"
      )
      this.setState({ houseReserve, ownerOfToken, betAmount })
    }
  }

  makeBet = () => {
    const { web3, contract, accounts } = this.props
    const { oddsPercentage, betAmount } = this.state
    if (contract) {
      const { methods } = web3.contract
      const from = accounts[0]
      const value = web3.utils.toWei(betAmount.toString(), "ether")
      methods
        .makeBet(TOKEN_ID, oddsPercentage)
        .send({ from, value, gas: 300000 }, res => {
          if (!res) {
            console.log("Transaction sent", res)
            // Transaction sent
          } else {
            console.log("Canceled", res)
            // Canceled
          }
        })
        .then(res => {
          const { BetResult } = res.events
          const { roll, win } = BetResult.returnValues
          console.log("Transaction went through")
          if (win) {
            // Show win result
            console.log("WINNER", roll)
          } else {
            // Show lose result
            console.log("LOSS", roll)
          }
        })
        .catch(e => {
          console.log("ERROR", e)
        })
    }
  }

  addToHouseReserve = () => {
    const { web3, contract, accounts } = this.props
    if (contract) {
      const { methods } = contract
      const from = accounts[0]
      const value = web3.utils.toWei("0.5", "ether")
      methods
        .addToHouseReserve(TOKEN_ID)
        .send({ from, value, gas: 300000 }, res => {
          if (!res) {
            console.log("Transaction sent", res)
            // Transaction sent
          } else {
            console.log("Canceled", res)
            // Canceled
          }
        })
        .then(res => {
          console.log("Transaction went through", res)
          // Transaction went through
        })
        .catch(e => {
          //
        })
    }
  }

  subtractFromHouseReserve = () => {}

  mint = async () => {
    const { contract, accounts } = this.props
    if (contract) {
      const { methods } = contract
      const from = accounts[0]
      const res = await methods
        .mint(TOKEN_ID)
        .send({ from, value: 0, gas: 300000 })
      console.log(res)
      this.refresh()
    }
  }

  render() {
    const { web3, accounts, web3Error } = this.props

    if (!web3) {
      if (web3Error) {
        return <div>ERROR: Cannot connect to web3</div>
      } else {
        return <div>Loading Web3, accounts, and contract...</div>
      }
    }

    const {
      oddsPercentage,
      betAmount,
      ownerOfToken,
      houseReserve,
      isManagingCasino,
      tokenMetadata
    } = this.state

    const payout = (betAmount * 99) / oddsPercentage
    const payoutInWei = web3.utils.toWei(payout.toString(), "ether")
    const payoutTooHigh = Number(payoutInWei) > Number(houseReserve)

    return (
      <Grommet plain>
        <Box align="center">
          <Box
            align="center"
            direction="column"
            border={{ color: "brand", size: "large" }}
            pad="medium"
            margin="medium"
            round={true}
            width="large"
          >
            <Heading textAlign="center" level={2}>
              {tokenMetadata.name}
            </Heading>
            <Box width="medium">
              <Text textAlign="center">{tokenMetadata.description}</Text>
            </Box>
            <Box>
              <ImageData tokenId={TOKEN_ID} />
              {tokenMetadata.descriptionEmojis.object}
            </Box>
            <Box
              align="center"
              direction="column"
              border={{ color: "brand", size: "medium" }}
              margin="medium"
              pad="medium"
              round={true}
            >
              <Box align="center">
                <Text level={5}>WIN CHANCE {oddsPercentage}%</Text>
              </Box>
              <Box margin="medium" width="medium">
                <RangeInput
                  min={1}
                  max={97}
                  value={oddsPercentage}
                  onChange={event =>
                    this.setState({
                      oddsPercentage: event.target.value
                    })
                  }
                />
              </Box>
              <Text>BET AMOUNT {betAmount} ETH</Text>
              <Box margin="medium">
                <TextInput
                  type="number"
                  value={betAmount}
                  onChange={event =>
                    this.setState({ betAmount: event.target.value })
                  }
                />
              </Box>
              <Box
                align="center"
                style={{ color: payoutTooHigh ? "red" : "black" }}
              >
                <Text>PAYOUT {payout} ETH</Text>
                {payoutTooHigh && (
                  <Text>
                    Not enough money in the house for a wager that high!
                  </Text>
                )}
              </Box>
            </Box>
            <Button label={"BET"} primary onClick={this.makeBet} />
            {ownerOfToken === accounts[0] && (
              <Button
                label={isManagingCasino ? "CLOSE" : "MANAGE MY TOKEN"}
                primary
                onClick={() =>
                  this.setState({
                    isManagingCasino: !isManagingCasino
                  })
                }
              />
            )}
            {isManagingCasino && (
              <HouseBank
                addToHouseReserve={this.addToHouseReserve}
                subtractFromHouseReserve={this.subtractFromHouseReserve}
              />
            )}
          </Box>
          {/* TODO: TEMP */}
          <div>
            <Button label={"MINT"} primary onClick={this.mint} />
          </div>
        </Box>
      </Grommet>
    )
  }
}

export default Main
