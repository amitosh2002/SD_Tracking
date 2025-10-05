import React, { useEffect } from 'react'
import Navbar from './Platform/Navbar'
import HeroSection from './Platform/HeroSection'
import "./App.css"
import EditorExample from './Platform/Editor'
import CreateBranch from './Platform/CreateBranch'
import TextEditor from './Platform/Editor'
import AllRoutes from './Platform/Route/AllRoutes'
import { BrowserRouter, Routes } from 'react-router-dom'
import { Layout } from 'lucide-react'
import Layoutv1 from './Platform/Layout/Layoutv1'
import { useDispatch } from 'react-redux'
import { fetchPlatformKeyValueAction } from './Redux/Actions/KeyValueActions/keyValueActions'
import { fetchUserDetails } from './Redux/Actions/PlatformActions.js/userActions'
import GlobalSnackbar from './customFiles/customComponent/SnackBars/globalSanckbar'
const App = () => {
   const dispatch = useDispatch();
        useEffect(() => {
            dispatch(fetchPlatformKeyValueAction());
            dispatch(fetchUserDetails());
        }, [dispatch]);
  return (
    <>
    {/* <Navbar/>
    <HeroSection/> */}
    {/* <EditorExample/> */}
    {/* <CreateBranch/> */}
    <BrowserRouter>

    <Layoutv1/>
    <GlobalSnackbar/>
    </BrowserRouter>
   
    </>
  )
}

export default App