import Vue from "vue"
import VueI18n, { LocaleMessageObject } from "vue-i18n"

Vue.use(VueI18n)

import itemNamesFr from "@/../static/itemNames-fr.json"
import categoryNamesFr from "@/../static/categoryNames-fr.json"
(window as any).itemNamesFr = itemNamesFr
import langFr from "@/lang/fr.json"

async function importLanguageMessages(locale: string): Promise<LocaleMessageObject> {
  const baseMessages = (await import(`@/lang/${locale}.json`)).default
  const itemNames = (await import(`@/../static/itemNames-${locale}.json`)).default
  const categoryNames = (await import(`@/../static/categoryNames-${locale}.json`)).default
  return Object.assign(baseMessages, {
    itemNames,
    categoryNames,
  })
}

export const i18n = new VueI18n({
  locale: "fr",
  fallbackLocale: "fr",
  messages: {
    fr: Object.assign(langFr, {
      itemNames: itemNamesFr,
      categoryNames: categoryNamesFr,
    }),
  },
})

const loadedLanguages = ["fr"] // our default language that is preloaded

function setI18nLanguage(locale: string) {
  i18n.locale = locale
  document.querySelector("html")!.setAttribute("lang", locale)
  return locale
}

export async function loadLanguageAsync(locale: string) {
  // If the same language
  if (i18n.locale === locale) {
    return Promise.resolve(setI18nLanguage(locale))
  }

  // If the language was already loaded
  if (loadedLanguages.includes(locale)) {
    return Promise.resolve(setI18nLanguage(locale))
  }

  // If the language hasn't been loaded yet
  const msgObject = await importLanguageMessages(locale)
  i18n.setLocaleMessage(locale, msgObject)
  loadedLanguages.push(locale)
  setI18nLanguage(locale)
}
