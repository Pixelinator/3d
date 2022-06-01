const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const assets = ["models"];
const path = require("path");

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, "src", "models"),
        to: path.resolve(__dirname, ".webpack/renderer", "models"),
      },
    ],
  }),
];

/**
assets.map((asset) => {
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "src", asset),
        to: path.resolve(__dirname, ".webpack/renderer", asset),
      },
    ]);
  }), */
