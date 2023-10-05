import { useContext } from "react";
import './Search.css'
import { Link } from "react-router-dom";
import { FaPlus, FaCheck, FaHome } from "react-icons/fa";
import ModalContext from "../../Context/ModalContext";

function Search() {

  const { setShow } = useContext(ModalContext);

  return (
    <div className='search-container'>
      <Link to={'/'} title="Home"><FaHome /></Link>
      <Link to={'/'} onClick={() => setShow(true)} title="Add a Job"><FaPlus /></Link>
      <Link to={'/completed'} title="Completed Jobs"><FaCheck /></Link>
    </div>
  )
}

export default Search