import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './Redux/store'
import "./App.css"
import Layoutv1 from './Platform/Layout/Layoutv1'
import GlobalSnackbar from './customFiles/customComponent/SnackBars/globalSanckbar'

// Make store available to axios interceptor
window.store = store;

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layoutv1/>
        <GlobalSnackbar/>
      </BrowserRouter>
    </Provider>
  )
}

export default App