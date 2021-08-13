import React, { useState } from "react"
import { Button, Text, TextInput, Box } from "grommet"
import { getNetworkId } from "../config"

const HouseBank = ({
  boxStyle,
  convertToEth,
  houseReserve,
  depositHouseReserve,
  withdrawalHouseReserve,
}) => {
  const currentBalance = convertToEth(houseReserve)
  const [amount, setAmount] = useState(currentBalance)
  const coin = getNetworkId() === 1 ? "ETH" : "MATIC"
  return (
    <Box {...boxStyle}>
      <Box margin="small">
        {[
          `Enter the amount of ${coin} you would`,
          "like to deposit or withdrawal from your casino.",
          "(Balance can be withdrawn at any time)",
        ].map((line, i) => {
          return (
            <Text textAlign="center" size="medium" key={i}>
              {line}
            </Text>
          )
        })}
        <Box margin="small">
          <Text textAlign="center" size="medium" weight="bold">
            Current Balance: {currentBalance} {coin}
          </Text>
        </Box>
      </Box>
      <Box margin="small">
        <TextInput
          type="number"
          value={amount}
          onChange={(event) => {
            if (event.target.value > 0) {
              setAmount(event.target.value)
            }
          }}
        />
      </Box>
      <Box margin="small">
        <Button
          label={"DEPOSIT"}
          primary
          onClick={() => depositHouseReserve(amount)}
        />
      </Box>
      <Box margin="small">
        <Button
          disabled={amount > currentBalance}
          label={"WITHDRAWL"}
          primary
          onClick={() => withdrawalHouseReserve(amount)}
        />
      </Box>
    </Box>
  )
}

export default HouseBank
