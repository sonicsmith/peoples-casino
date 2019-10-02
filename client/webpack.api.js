"use strict"
const webpack = require("webpack")

// webpack.functions.js just for api
module.exports = {
  plugins: [new webpack.IgnorePlugin(/^electron$/)]
}
