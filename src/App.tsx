import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import Homepage from './Pages/Homepage/Homepage';
import Search from './Components/Search/Search';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ModalContextProvider } from './Context/ModalContext';
import CompletedJobs from './Pages/CompletedJobs/CompletedJobs';
import Login from './Pages/Login/Login';
import './App.css';
import { useState } from 'react';
import MyCalendar from './Pages/MyCalendar/MyCalendar';
import Analytics from './Pages/Analytics/Analytics';
import Settings from './Pages/Settings/Settings';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [isMobile, setIsMobile] = useState<boolean>(false);

  window.addEventListener('resize', () => {
    setIsMobile(screen.width < 1000);
  });

  return (
    <BrowserRouter>
      <ModalContextProvider>
        <div className='app-container'>
          {
            isMobile ?

              <div className='error-container'>
                <h1>Sorry, Just Works was built for the desktop.</h1>
                <h2>Please use a screen atleast 1000px wide to view this website.</h2>
              </div>

              :
              <>
                {
                  isLoggedIn &&
                  <Search setIsLoggedIn={setIsLoggedIn} />
                }
                <Routes>
                  <Route path="/" element={isLoggedIn ? (<Homepage />) : (<Navigate to={isLoggedIn ? '/' : "/login"} />)} />
                  <Route path="/completed" element={isLoggedIn ? (<CompletedJobs />) : (<Navigate to={isLoggedIn ? 'complete' : "/login"} />)} />
                  <Route path='/calendar' element={isLoggedIn ? (<MyCalendar />) : (<Navigate to={isLoggedIn ? 'calendar' : "/login"} />)} />
                  <Route path='/analytics' element={isLoggedIn ? (<Analytics />) : (<Navigate to={isLoggedIn ? 'analytics' : "/login"} />)} />
                  <Route path="/login" element={isLoggedIn ? (<Navigate to="/" />) : (<Login setIsLoggedIn={setIsLoggedIn} />)} />
                  <Route path="/settings" element={isLoggedIn ? (<Settings />) : (<Navigate to={isLoggedIn ? 'settings' : "/login"} />)} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </>
          }
        </div>
      </ModalContextProvider>
    </BrowserRouter >
  );
}

export default App;
