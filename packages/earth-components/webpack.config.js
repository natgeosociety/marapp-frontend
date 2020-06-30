const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: ["./entry.js"],
  output: {
    path: path.resolve(__dirname, "src/icon-font/compiled"),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.font\.js/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          "webfonts-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "icon-font.scss",
    }),
  ],
};
