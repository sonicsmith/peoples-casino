import React from "react"
import "./Loading.css"
import image from "./../img/404.png"

const NoToken = ({ loading, web3Error }) => {
  return (
    <div
      style={{
        display: "block",
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
            <img src={image} width="20%" height="auto" />
          </div>
          <div style={{ textAlign: "center" }}>
            <h1>OH NOES!</h1>
            <h2>
              {web3Error
                ? "The casino you are trying to visit can not be found"
                : "Cannot connect to the blockchain"}
            </h2>
          </div>
        </div>
      )}
    </div>
  )
}

export default NoToken
