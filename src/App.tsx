import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Homepage from './Pages/Homepage/Homepage';
import Search from './Components/Search/Search';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ModalContextProvider } from './Context/ModalContext';
import CompletedJobs from './Pages/CompletedJobs/CompletedJobs';

function App() {
  return (
    <ModalContextProvider>
      <BrowserRouter>
        <div className='app-container'>
          <Search />
          <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/completed' element={<CompletedJobs/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </ModalContextProvider>
  );
}

export default App;