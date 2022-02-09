let HtmlWebpackPlugin = require("html-webpack-plugin");
let CopyWebpackPlugin = require("copy-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const path = require("path");
module.exports = {
  entry: "./src/index.js",
  devServer: {
    port: 8083,
  },
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "[name].[contenthash].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.s(c|a)ss$/,
        use: [
          "vue-style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            // Requires sass-loader@^8.0.0
            options: {
              implementation: require("sass"),
              sassOptions: {
                indentedSyntax: true, // optional
              },
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      // ... other rules
      {
        test: /\.css$/,
        use: ["vue-style-loader", "style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: ["public/CNAME"],
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new VueLoaderPlugin(),
  ],
};
