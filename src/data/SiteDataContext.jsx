import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as defaults from './dummyData'
import { apiRequest } from './api'

const initialData = {
  settings: [defaults.company],
  services: defaults.services,
  products: defaults.products,
  courses: defaults.courses,
  projects: defaults.projects,
  stats: defaults.stats,
  heroSlides: [
    { id: 'electrical-engineering', label: 'Electrical engineering', image: defaults.services[2].image },
    { id: 'industrial-systems', label: 'Industrial systems', image: defaults.services[0].image },
    { id: 'clean-energy', label: 'Clean energy', image: defaults.services[1].image },
    { id: 'power-in-motion', label: 'Power in motion', image: defaults.projects[1].image, video: 'https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4' },
  ],
  siteContent: [],
}

const SiteDataContext = createContext({ ...initialData, company: defaults.company, apiError: null })

export function SiteDataProvider({ children }) {
  const [data, setData] = useState(initialData)
  const [apiError, setApiError] = useState(null)

  useEffect(() => {
    let active = true
    apiRequest('/api/site')
      .then((response) => {
        if (!active) return
        setData((current) => Object.fromEntries(
          Object.keys(initialData).map((key) => [key, Array.isArray(response[key]) ? response[key] : current[key]]),
        ))
        setApiError(null)
      })
      .catch((error) => {
        if (active) setApiError(error.message)
      })
    return () => { active = false }
  }, [])

  const value = useMemo(() => ({
    ...data,
    company: data.settings[0] || defaults.company,
    apiError,
  }), [data, apiError])

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>
}

export function useSiteData() {
  return useContext(SiteDataContext)
}
