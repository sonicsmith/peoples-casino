import React from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import Main from "./components/Main"
import { Api } from "./Api"

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Main} />
      <Route path="/api/" component={Api} />
    </Router>
  )
}

export default App
