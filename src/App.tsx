import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import Homepage from './Pages/Homepage/Homepage';
import Search from './Components/Search/Search';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ModalContextProvider } from './Context/ModalContext';
import CompletedJobs from './Pages/CompletedJobs/CompletedJobs';
import { useSignInWithGoogle, useSignOut } from 'react-firebase-hooks/auth';
import { auth } from './Config/firebaseConfig';
import Login from './Pages/Login/Login';
import './App.css';
import { useState } from 'react';

function App() {
  const [signOut] = useSignOut(auth);
  const [signInWithGoogle, error, loading, user] = useSignInWithGoogle(auth);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const signIn = async () => {
    const success = await signInWithGoogle();
    if(success) {
      console.log('Signed in')
      setIsLoggedIn(true);
    }
  }

  return (
    <BrowserRouter>
      <ModalContextProvider>
        <div className='app-container'>
          {
            isLoggedIn &&
            <Search signOut={signOut} setIsLoggedIn={setIsLoggedIn}/>
          }
          <Routes>
            <Route path="/" element={isLoggedIn ? (<Homepage />) : (<Navigate to={isLoggedIn ? '/' : "/login"} />)} />
            <Route path="/completed" element={isLoggedIn ? (<CompletedJobs />) : (<Navigate to={isLoggedIn ? 'complete' : "/login"} />)} />
            <Route path="/login" element={isLoggedIn ? (<Navigate to="/" />) : (<Login signInWithGoogle={signIn} loading={loading} error={error} setIsLoggedIn={setIsLoggedIn} />)} />
          </Routes>
        </div>
      </ModalContextProvider>
    </BrowserRouter >
  );
}

export default App;
