import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import Main from "./components/Main"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter as Router, Route } from "react-router-dom"
import TokenImage from "./components/TokenImage"

const RoutedApp = () => {
  return (
    <Router>
      <Route exact path="/" component={Main} />
      <Route
        exact
        path="/image/:tokenId"
        render={({ match }) => {
          const { tokenId } = match.params
          if (tokenId && !isNaN(tokenId)) {
            return <TokenImage tokenId={tokenId} />
          }
        }}
      />
      <Route
        exact
        path="/token/:tokenId"
        render={({ match }) => {
          const { tokenId } = match.params
          if (!tokenId || isNaN(tokenId)) {
            return <Main />
          } else {
            return <App tokenId={tokenId} />
          }
        }}
      />
    </Router>
  )
}

ReactDOM.render(<RoutedApp />, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
