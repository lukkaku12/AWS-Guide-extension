const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    popup: "./src/popup.js",
    content: "./src/content.js",
    background: "./src/background.js",
    driver: './src/driver.js/dist/driver.js.mjs',
  },
  devtool: "source-map",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src/**"),
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.mjs$/,
        include: path.resolve(__dirname, "src/driver.js/dist/**"), // Solo procesar archivos dentro de 'src'
        type: "javascript/auto",
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ['@babel/plugin-transform-modules-commonjs'], 
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json", ".jsx", ".css", ".html", ".mjs"],
    fallback: {
      path: require.resolve("path-browserify"),
      os: require.resolve("os-browserify/browser"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer"),
      process: require.resolve("process/browser"),
      vm: require.resolve("vm-browserify"),
      readableStream: require.resolve("readable-stream"),
    },
    alias: {
      'driver.js': path.resolve(__dirname, './dist/driver.js'),
      "driver.css": path.resolve(__dirname, "./dist/driver.css"),
    },
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: "./src/popup.html",
      filename: "popup.html",
    }),
    new MiniCssExtractPlugin({
      filename: "styles.css",
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
    new CopyPlugin({
      patterns: [
        // {
        //   from: path.resolve(__dirname, "src/driver.js/dist/driver.js.mjs"), // Archivo fuente
        //   to: path.resolve(__dirname, "dist/driver.js"),
        // },
        { from: "src/driver.js/dist/driver.css", to: "driver.css" }, // Copiar driver.css a dist/
      ],
    }),
  ],
  devServer: {
    static: "./dist",
    hot: true,
  },
  mode: "development", // Cambia a 'production' cuando vayas a publicar
};
