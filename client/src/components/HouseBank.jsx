import React, { useState } from "react"
import { Button, Heading, Text, RangeInput, TextInput, Box } from "grommet"

const HouseBank = ({
  boxStyle,
  refreshData,
  convertToEth,
  houseReserve,
  addToHouseReserve,
  subtractFromHouseReserve
}) => {
  const currentBalance = convertToEth(houseReserve)
  const [amount, setAmount] = useState(currentBalance)
  return (
    <Box {...boxStyle}>
      <Box margin="small">
        {[
          "Enter the amount of ETH you would",
          "like to deposit into your token.",
          "(House balance can be withdrawn at any time)"
        ].map((line, i) => {
          return (
            <Text textAlign="center" size="medium" key={i}>
              {line}
            </Text>
          )
        })}
        <Box margin="small">
          <Text textAlign="center" size="medium" weight="bold">
            Current Balance: {currentBalance} ETH
          </Text>
        </Box>
      </Box>
      <Box margin="small">
        <TextInput
          type="number"
          value={amount}
          onChange={event => {
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
          onClick={() => addToHouseReserve(amount)}
        />
      </Box>
      <Box margin="small">
        <Button
          disabled={amount > currentBalance}
          label={"WITHDRAWL"}
          primary
          onClick={() => subtractFromHouseReserve(amount)}
        />
      </Box>
    </Box>
  )
}

export default HouseBank
