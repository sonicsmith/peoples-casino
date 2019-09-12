import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import NoToken from "./components/NoToken"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter as Router, Route } from "react-router-dom"

const RoutedApp = () => {
  return (
    <Router>
      <Route
        exact
        path="/:tokenId"
        render={({ match }) => {
          const { tokenId } = match.params
          if (tokenId && Number(tokenId) > 0) {
            return <App tokenId={tokenId} />
          } else {
            return <NoToken loading={false} />
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
