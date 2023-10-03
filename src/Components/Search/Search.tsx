import { useContext } from "react";
import { ModalContext } from "../../Context/ModalContext";
import './Search.css'
import { Link } from "react-router-dom";
import { FaPlus, FaCheck, FaHome } from "react-icons/fa";

function Search() {

  const { show, setShow } = useContext(ModalContext);

  return (
    <div className='search-container'>
      <Link to={'/'}><FaHome /></Link>
      <Link to={'/'} onClick={() => setShow(true)}><FaPlus /></Link>
      <Link to={'/completed'}><FaCheck /></Link>
    </div>
  )
}

export default Search