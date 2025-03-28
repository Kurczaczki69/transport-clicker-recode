const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/js/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    assetModuleFilename: "assets/[hash][ext][query]",
    publicPath: "/dist/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              url: true,
              import: true,
              modules: false,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp|ico)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(mp3|wav|ogg|flac)$/,
        type: "asset/resource",
      },
      {
        test: /\.json$/,
        type: "json",
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/lang",
          to: "lang",
        },
      ],
    }),
  ],
  resolve: {
    extensions: [".js", ".json", ".css"],
    fallback: {
      path: false,
      fs: false,
    },
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
};
