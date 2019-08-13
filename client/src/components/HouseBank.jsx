import React, { useState } from "react"
import { Button, Heading, Text, RangeInput, TextInput, Box } from "grommet"

const HouseBank = ({ addToHouseReserve, subtractFromHouseReserve }) => {
  const [amount, setAmount] = useState(0)
  return (
    <Box>
      <TextInput
        type="number"
        value={amount}
        onChange={event => setAmount(event.target.value)}
      />
      <Button
        label={"DEPOSIT"}
        primary
        onClick={() => addToHouseReserve(amount)}
      />
      <Button
        label={"WITHDRAWL"}
        primary
        onClick={() => subtractFromHouseReserve(amount)}
      />
    </Box>
  )
}

export default HouseBank
