const WorkerPlugin = require("worker-plugin")

module.exports = {
  transpileDependencies: ["vuetify"],

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "lang",
      enableInSFC: false,
    },
  },

  configureWebpack: {
    module: {
      /* rules: [{ test: /\.worker\.ts$/, use: ["worker-loader", "ts-loader"] }], */
    },
    plugins: [new WorkerPlugin()],
  },

  css: {
    loaderOptions: {
      scss: {
        sassOptions: {
          indentedSyntax: false,
        },
        additionalData: `
          @import "@/scss/_variables.scss";
          @import "@/scss/main.scss";
        `,
      },
    },
  },
}
