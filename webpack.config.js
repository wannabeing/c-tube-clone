const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BASE_PATH = "./src/frontend/js/";

module.exports = {
  entry: {
    main: BASE_PATH + "main.js",
    videoPlayer: BASE_PATH + "videoPlayer.js",
    selectEdit: BASE_PATH + "selectEdit.js",
    videoRecorder: BASE_PATH + "videoRecorder.js",
    userProfile: BASE_PATH + "userProfile.js",
    comment: BASE_PATH + "comment.js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  watch: true,
  mode: "development",
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "static"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
