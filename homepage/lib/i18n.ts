import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en'
import fr from '../locales/fr'
import ja from '../locales/ja'
import ko from '../locales/ko'
import nl from '../locales/nl'
import zh from '../locales/zh'
import pt from '../locales/pt'
import ptBR from '../locales/ptBR'
import ru from '../locales/ru'
import es from '../locales/es'
import de from '../locales/de'
import vn from '../locales/vn'
import hr from '../locales/hr'
import tr from '../locales/tr'

const resources = {
  en,
  fr,
  ja,
  ko,
  nl,
  zh,
  pt,
  ptBR,
  ru,
  es,
  de,
  vn,
  hr,
  tr
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
