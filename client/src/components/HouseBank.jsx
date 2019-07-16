import React, { useState } from "react"
import { Button, Heading, Text, RangeInput, TextInput, Box } from "grommet"

export const HouseBank = ({ deposit, withdrawl }) => {
  const [amount, setAmount] = useState(0)
  return (
    <Box>
      <TextInput
        type="number"
        value={amount}
        onChange={event => setAmount(event.target.value)}
      />
      <Button label={"DEPOSIT"} primary onClick={() => this.deposit(amount)} />
      <Button
        label={"WITHDRAWL"}
        primary
        onClick={() => this.withdrawl(amount)}
      />
    </Box>
  )
}
