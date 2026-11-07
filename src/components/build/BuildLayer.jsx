import { useLayoutEffect } from 'react'
import './build.css'
import { startBuild } from './buildEngine'

export default function BuildLayer({ dark = true }) {
  useLayoutEffect(() => {
    document.documentElement.dataset.bl = dark ? 'dark' : 'light'
  }, [dark])

  useLayoutEffect(() => startBuild(), [])
  return null
}