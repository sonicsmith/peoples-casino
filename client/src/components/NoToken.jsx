import React from "react"
import "./Loading.css"
import image from "./../img/no-token.svg"

const NoToken = ({ loading, web3Error }) => {
  return (
    <div
      style={{
        margin: "auto",
        color: "white",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#1ABC9C"
      }}
    >
      {loading ? (
        <div style={{ textAlign: "center" }}>
          <div className="lds-facebook">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ textAlign: "center" }}>
            <img src={image} height="auto" alt="Shocked face" />
          </div>
          <div style={{ textAlign: "center" }}>
            <h1>OH NOES!</h1>
            <h2>
              {web3Error
                ? "Cannot connect to the blockchain"
                : "The casino you are trying to visit can not be found"}
            </h2>
          </div>
        </div>
      )}
    </div>
  )
}

export default NoToken
