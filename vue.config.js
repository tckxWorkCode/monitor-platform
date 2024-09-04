module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  lintOnSave: false,
  productionSourceMap: false,
  publicPath: process.env.VUE_APP_PBPATH,
  
  //更改页面title
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  },
  //开发环境代理    
  devServer: {
    historyApiFallback: {
      index: '/index.html'
    },
    client: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: 'https://192.168.1.170', 
        pathRewrite: {
          // "^/api": "",
        }, 
        changeOrigin: true,
        secure: false,
      }, 
    },
  },
};