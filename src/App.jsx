import React from 'react'
import Navbar from './Platform/Navbar'
import HeroSection from './Platform/HeroSection'
import "./App.css"
import EditorExample from './Platform/Editor'
import CreateBranch from './Platform/CreateBranch'
import TextEditor from './Platform/Editor'
import AllRoutes from './Platform/Routex/AllRoutes'
import { BrowserRouter, Routes } from 'react-router-dom'
import { Layout } from 'lucide-react'
import Layoutv1 from './Platform/Layout/Layoutv1'
const App = () => {
  return (
    <>
    {/* <Navbar/>
    <HeroSection/> */}
    {/* <EditorExample/> */}
    {/* <CreateBranch/> */}
    <BrowserRouter>

    <Layoutv1/>
    </BrowserRouter>
   
    </>
  )
}

export default App