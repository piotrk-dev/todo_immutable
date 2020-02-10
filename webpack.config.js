const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const env = process.env.ENV;

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          { loader: 'css-loader' },
          // Compiles Sass to CSS
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  devtool: env !== "DEV" ? "eval-source-map" : "eval",
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    historyApiFallback: true
  },
};