const isProd = process.env.NODE_ENV === "production";

module.exports = {
  transpileDependencies: ["vuetify"],
  productionSourceMap: false,
  publicPath: isProd ? "/wp-content/themes/ethiquable/dist/" : "/",
  filenameHashing: false,
  configureWebpack: {
    optimization: {
      splitChunks: false
    },
    output: {
      filename: "[name].js",
      chunkFilename: "[name].js"
    }
  },
  css: {
    extract: {
      filename: "[name].css",
      chunkFilename: "[name].css"
    }
  }
};
