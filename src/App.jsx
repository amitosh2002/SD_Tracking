import React from 'react'
import Navbar from './Platform/Navbar'
import HeroSection from './Platform/HeroSection'
import "./App.css"
import EditorExample from './Platform/Editor'
import CreateBranch from './Platform/CreateBranch'
import TextEditor from './Platform/Editor'
import AllRoutes from './Platform/Routex/AllRoutes'
import { Routes } from 'react-router-dom'
const App = () => {
  return (
    <>
    {/* <Navbar/>
    <HeroSection/> */}
    {/* <EditorExample/> */}
    {/* <CreateBranch/> */}
    <div className="app-container">
    <Navbar />
      {/* You can add a header or any other component here if needed */}

      <AllRoutes  />
      </div>
    </>
  )
}

export default App