import React from "react"
import image from "./../img/404.png"

const NoToken = ({ loading }) => {
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
        <div style={{ textAlign: "center" }}>LOADING</div>
      ) : (
        <div>
          <div style={{ textAlign: "center" }}>
            <img src={image} width="20%" height="auto" />
          </div>
          <div style={{ textAlign: "center" }}>
            <h1>OH NOES!</h1>
            <h2>The casino you are trying to visit can not be found</h2>
          </div>
        </div>
      )}
    </div>
  )
}

export default NoToken
