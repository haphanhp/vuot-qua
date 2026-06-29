import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { strings, type Lang, type Strings } from './strings'

type LangCtx = {
  lang: Lang
  t: Strings
  setLang: (l: Lang) => void
}

const LangContext = createContext<LangCtx>({
  lang: 'vi',
  t: strings.vi,
  setLang: () => {},
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('lang') as Lang) || 'unset' as Lang
  })

  const setLang = (l: Lang) => {
    localStorage.setItem('lang', l)
    setLangState(l)
  }

  const t = strings[lang as Lang] || strings.vi

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
