const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    main: "./src/frontend/js/main.js",
    videoPlayer: "./src/frontend/js/videoPlayer.js",
    selectEdit: "./src/frontend/js/selectEdit.js",
    videoRecorder: "./src/frontend/js/videoRecorder.js",
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
