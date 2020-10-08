module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/react"]
        }
      },
      {
        test: /\.js?$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/react"]
        }
      }

    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  }
};
