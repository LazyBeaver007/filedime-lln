"use client"

import React, { useEffect, useState } from "react"
// Lazy-import Tauri APIs inside the client effect to avoid SSR import errors

type GitStatus = {
  isRepo: boolean
  hasCommits: boolean
  hasChanges: boolean
}

export default function GitStatusIndicator() {
  const [status, setStatus] = useState<GitStatus | null>(null)
  const [checkedPath, setCheckedPath] = useState<string | null>(null)

  async function fetchStatus(pathToCheck?: string) {
    try {
      if (typeof window === "undefined") return

      const tauri = await import('@tauri-apps/api/tauri')
      const pathApi = await import('@tauri-apps/api/path')
      const home = pathToCheck ?? (await pathApi.homeDir())
      console.log("[git-status] invoking check_git_status with", home)
      const res = await tauri.invoke<string>("check_git_status", { path: home })
      console.log("[git-status] raw response:", res)
      const parsed: GitStatus = JSON.parse(res)
      console.log("[git-status] parsed:", parsed)
      setStatus(parsed)
    } catch (e) {
      console.error("[git-status] failed to fetch status:", e)
    }
  }

  useEffect(() => {
    // initial check using home dir or the latest checkedPath
    fetchStatus(checkedPath ?? undefined)
    const id = setInterval(() => fetchStatus(checkedPath ?? undefined), 5000)
    return () => clearInterval(id)
  }, [checkedPath])

  useEffect(() => {
    // listen for path changes from the rest of the UI
    function handler(e: any) {
      const p = e?.detail ?? null
      setCheckedPath(p)
      fetchStatus(p ?? undefined)
    }
    window.addEventListener('filedime:path-changed', handler as EventListener)
    return () => window.removeEventListener('filedime:path-changed', handler as EventListener)
  }, [])

  const dot = (on: boolean, color: string, title?: string) => (
    <div
      title={title}
      role="img"
      aria-label={title}
      style={{
        width: 12,
        height: 12,
        borderRadius: "9999px",
        backgroundColor: on ? color : "#9CA3AF",
        boxShadow: on ? `0 0 6px ${color}` : "none",
      }}
    />
  )

  const item = (labelText: string, on: boolean, color: string, title?: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {dot(on, color, title)}
      <span style={{ fontSize: 12, color: on ? color : "#FFFFFF" }}>
        {labelText}: {on ? "yes" : "no"}
      </span>
    </div>
  )

  async function openExternal(url?: string) {
    if (!url) return
    try {
      const shell = await import('@tauri-apps/api/shell')
      await shell.open(url)
    } catch (e) {
      // fallback for browser/dev: open in new tab
      try {
        window.open(url, '_blank', 'noopener')
      } catch (_) {}
    }
  }

  return (
    <div style={{ position: "fixed", top: 8, right: 8, zIndex: 9999 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {status ? (
          <>
            {item("repository", status.isRepo, "#ff5f57", "is repository")}
            {item("has commits", status.hasCommits, "#ffbd2e", "has commits")}
            {item("has changes", status.hasChanges, "#27c93f", "has uncommitted changes")}
          </>
        ) : (
          <>
            {item("repository", false, "#ff5f57", "is repository")}
            {item("has commits", false, "#ffbd2e", "has commits")}
            {item("has changes", false, "#27c93f", "has uncommitted changes")}
          </>
        )}
      </div>
    </div>
  )
}
