import { useState } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import ModalContextProvider from './Context/ModalContext'
import Homepage from './Pages/Homepage/Homepage'
import Search from './Components/Search/Search'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <ModalContextProvider>
      <BrowserRouter>
        <Search />
        <Routes>
          <Route path='/' element={<Homepage />} />
        </Routes>
      </BrowserRouter>
    </ModalContextProvider>
  )
}

export default App
