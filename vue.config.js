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
