// 'use client'
// import { ThemeProvider } from "../src/components/ThemeContext"
import React from "react"
import { Providers } from "../src/components/ThemeContext"
import Footer from "../src/components/footer"
// import Thedarkhtml from "../src/components/thedarkhtml"
import Topthread from "../src/components/topthread"
import TauriPolyfill from "../src/components/tauri-polyfill"
import GitStatusIndicator from "../src/components/git-status-indicator"
// import { useLocalStorage } from "../src/components/useLocalStorage"
import '../styles/globals.css'
import DarkButton from "../components/but"
import {Metadata} from 'next'


export const metadata:Metadata = {
  title: 'FileGPT-Filedime',
  description: 'Query your files.',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // const [showon, setshow] = useLocalStorage("dark",true);
  return (
    <html suppressHydrationWarning className="min-h-screen" lang="en">
      <body className="min-h-screen flex flex-col dark:bg-gray-900">
        <Providers>

        <TauriPolyfill />
        <GitStatusIndicator />
        <div className="glass p-6 w-full min-h-screen flex-1">
          {/* main app content uses frosted glass styles and fills viewport */}
          {children}
        </div>

        </Providers>

        {/* <Footer/> */}
      </body>

    </html>
  )
}
