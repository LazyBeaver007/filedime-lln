'use client';
import { useState,useEffect, useContext } from 'react';
import React from "react";
// import { useLocalStorage } from '../src/components/useLocalStorage';
// import { ThemeContext } from '../src/components/ThemeContext';
import { useTheme } from 'next-themes';
import '../styles/imgstutter.css'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Moon, Sun } from 'lucide-react';
// export function darkorwhite(){
//   let key="dark";
//   let wtr=false;
//   try {
//     // Get from local storage by key
//     const item = window.localStorage.getItem(key);
//     console.log(item)
//     // Parse stored json or if none return initialValue
//     wtr= item ? JSON.parse(item) : false;
//   } catch (error) {
//     // If error also return initialValue
//     console.log(error);
//     wtr= false;
//   }
//   if(wtr){
//     return(
//       <>
//       </>
//     )
//   }
//   // return {wtr}
// }

export default function DarkButton() {
  // console.log(localStorage.getItem("dark"))
  // const [showon, setshow] = useLocalStorage("dark",true);
  const { theme, setTheme } = useTheme()
  // const { dark, toggle } = useContext(ThemeContext);
  // const [ dark, setdark ] = useState(false);
  // const [showon, setshow] = useLocalStorage("dark",true);
  // console.log("onload"+showon)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  // useEffect(() => {
  //   console.log("sadsd")
  // },[showon]);
  return (
    <>
    
    <div className='dark:bg-gray-900 h-10'>
    <span className='p-2.5 absolute right-0'>

      <button
        id="theme-toggle"
        type="button"
        aria-label="light dark mode toggle"
        className={`rounded-lg text-sm p-2.5 ${mounted ? (theme === 'dark' ? 'text-white' : 'text-gray-900') : 'text-gray-400'}`}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        {/* Render icons only after client mount to avoid hydration mismatch */}
        {mounted ? (
          theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
        ) : (
          <span className="h-4 w-4 inline-block" />
        )}
      </button>
      </span>
    </div>

    </>
  );
}
