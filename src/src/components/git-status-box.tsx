"use client"

import React, { useEffect, useState } from "react"

type GitStatusFull = {
  isRepo: boolean
  hasCommits: boolean
  hasChanges: boolean
  branch?: string | null
  remote?: string | null
  lastCommit?: string | null
}

export default function GitStatusBox() {
  const [status, setStatus] = useState<GitStatusFull | null>(null)
  const [checkedPath, setCheckedPath] = useState<string | null>(null)

  async function fetchStatus(pathToCheck?: string) {
    try {
      if (typeof window === "undefined") return
      const tauri = await import("@tauri-apps/api/tauri")
      const pathApi = await import("@tauri-apps/api/path")
      const home = pathToCheck ?? (await pathApi.homeDir())
      const res = await tauri.invoke<string>("check_git_status", { path: home })
      const parsed: GitStatusFull = JSON.parse(res)
      setStatus(parsed)
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    fetchStatus(checkedPath ?? undefined)
    const id = setInterval(() => fetchStatus(checkedPath ?? undefined), 5000)
    return () => clearInterval(id)
  }, [checkedPath])

  useEffect(() => {
    function handler(e: any) {
      const p = e?.detail ?? null
      setCheckedPath(p)
      fetchStatus(p ?? undefined)
    }
    window.addEventListener("filedime:path-changed", handler as EventListener)
    return () => window.removeEventListener("filedime:path-changed", handler as EventListener)
  }, [])

  async function openExternal(url?: string) {
    if (!url) return
    try {
      const shell = await import("@tauri-apps/api/shell")
      await shell.open(url)
    } catch (e) {
      try {
        window.open(url, "_blank", "noopener")
      } catch (_) {}
    }
  }

  if (!status) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 8,
        left: "calc(50% + 150px)",
        transform: "translateX(-50%)",
        zIndex: 10000,
        pointerEvents: "none",
        width: "100%",
      }}
    >
      <div style={{ margin: "0 auto", pointerEvents: "auto", width: "min(55vw,360px)", boxSizing: "border-box" }}>
        <div
          style={{
            padding: "6px 8px",
            background: "rgba(17,24,39,0.95)",
            borderRadius: 8,
            color: "#E5E7EB",
            fontSize: "clamp(11px,1vw,12px)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.30)",
            overflow: "hidden",
          }}
        >
          <div style={{ fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {status.branch === "HEAD" || !status.branch
              ? "Branch is at HEAD"
              : `Branch that had the latest commit: ${status.branch}`}
          </div>

          <div style={{ marginTop: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            <strong style={{ marginRight: 8 }}>Remote:</strong>
            {status.remote ? (
              <a
                href={status.remote}
                onClick={(e) => {
                  e.preventDefault()
                  openExternal(status.remote!)
                }}
                style={{ color: "#9AE6B4", textDecoration: "underline", wordBreak: "break-all" }}
                title={status.remote}
              >
                {status.remote.length > 80 ? status.remote.slice(0, 80) + "..." : status.remote}
              </a>
            ) : (
              <span>—</span>
            )}
          </div>

          <div style={{ marginTop: 6, textAlign: "center", fontWeight: 700, paddingBottom: 2 }}>
            Commit: <span style={{ fontWeight: 500 }}>{status.lastCommit ? status.lastCommit.slice(0, 8) : "—"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
