const { defineConfig } = require('@vue/cli-service')
const path = require("path");

module.exports = defineConfig({
  transpileDependencies: true,
  runtimeCompiler: true,

  configureWebpack: {
    resolve: {
      alias: {
        'config.js': path.resolve(__dirname, "./config")
      }
    },
    externals: {
      config: 'config',
    }
  },
})
