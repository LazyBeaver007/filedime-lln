'use client'

import { useEffect } from 'react'

export default function TauriPolyfill() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (typeof (window as any).__TAURI_IPC__ !== 'function') {
          (window as any).__TAURI_IPC__ = function () {
            // noop placeholder to prevent "is not a function" errors when running in a browser
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }, [])

  return null
}
