// 'use client'
// import { ThemeProvider } from "../src/components/ThemeContext"
import React from "react"
import { Providers } from "../src/components/ThemeContext"
import Footer from "../src/components/footer"
// import Thedarkhtml from "../src/components/thedarkhtml"
import Topthread from "../src/components/topthread"
import TauriPolyfill from "../src/components/tauri-polyfill"
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
    <html suppressHydrationWarning className="h-full" lang="en">
      <body className="h-full flex flex-col dark:bg-gray-900">
        <Providers>

        <TauriPolyfill />
        <div className="glass p-6 m-6 w-full max-w-7xl mx-auto">
          {/* main app content uses frosted glass styles */}
          {children}
        </div>

        </Providers>

        {/* <Footer/> */}
      </body>

    </html>
  )
}
