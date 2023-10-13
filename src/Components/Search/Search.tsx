import { useContext, useEffect, useState } from "react";
import './Search.css'
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaCheck, FaHome, FaCalendar, FaChartBar } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import ModalContext from "../../Context/ModalContext";
import Button from 'react-bootstrap/Button'
import { auth } from "../../Config/firebaseConfig";

function Search({ signOut, setIsLoggedIn }) {

  const { setShowAddModal } = useContext(ModalContext);
  const [userInitials, setUserInitials] = useState('');

  const navigate = useNavigate();

  const logOut = async () => {
    const success = await signOut();
    if (success) {
      console.log('Signed out')
      setIsLoggedIn(false);
      navigate('/login')
    } // Navigate to the login page after signing out
  };

  const user = auth.currentUser;

  useEffect(() => {
    const name = user?.displayName;
    const initials = name?.split(' ').map((n: string) => n[0]).join('') ?? ''; // Provide '' as the default value
    setUserInitials(initials);
  }, [user]);

  return (
    <div className='search-container'>
      <Link to={'/'} title="Home"><FaHome /></Link>
      <Link to={'/'} onClick={() => setShowAddModal(true)} title="Add a Job"><FaPlus /></Link>
      <Link to={'/completed'} title="Completed Jobs"><FaCheck /></Link>
      <Link to={'/calendar'} title="Calendar"><FaCalendar /></Link>
      <Link to={'/analytics'} title="Analytics"><FaChartBar /></Link>

      <div className='user' title={user?.displayName}>{userInitials}L</div>
      <Button onClick={logOut} title="Sign out"><BiLogOut /></Button>
    </div>
  )
}

export default Search