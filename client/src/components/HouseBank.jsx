import React, { useState } from "react"
import { Button, Heading, Text, RangeInput, TextInput, Box } from "grommet"

const HouseBank = ({
  convertToEth,
  houseReserve,
  addToHouseReserve,
  subtractFromHouseReserve
}) => {
  const [amount, setAmount] = useState(0)
  const currentBalance = convertToEth(houseReserve)
  return (
    <Box
      align="center"
      direction="column"
      border={{ color: "border", size: "large" }}
      margin="small"
      pad="medium"
      round={true}
      background="white"
    >
      <Box margin="small">
        {[
          "Enter the amount of ETH you would",
          "like to deposit into your token.",
          "(House balance can be withdrawn at any time)"
        ].map(line => {
          return (
            <Text textAlign="center" size="medium">
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
          onChange={event => setAmount(event.target.value)}
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
          label={"WITHDRAWL"}
          primary
          onClick={() => subtractFromHouseReserve(amount)}
        />
      </Box>
    </Box>
  )
}

export default HouseBank
