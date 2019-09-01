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

const NoToken = ({ loading }) => {
  if (loading) {
    return <div>LOADING</div>
  }
  return (
    <div>
      <h1>Error, the casino you are trying to reach does not exist</h1>
    </div>
  )
}

export default NoToken
