const path = require('path');
const SizePlugin = require('size-plugin');

module.exports = {
  entry: {
    main: ['./src/index.ts'],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'potree.js',
    library: 'potree',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  devtool: 'eval-cheap-source-map',
  stats: 'errors-only',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  externals: ['three'],
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        loader: 'worker-loader',
        options: { inline: 'no-fallback' },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },

      { test: /\.(vs|fs|glsl|vert|frag)$/, loader: 'raw-loader' },
    ],
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [new SizePlugin()],
};
