import '../css/NavBar.css'
import { Link } from 'react-router-dom'

function NavBar(){
  return <nav className="navbar">
    <h2 className="navbar-logo">MovieApp</h2>
    <ul className="navbar-links">
      <li><Link to="/">Home</Link></li>
      <li><Link to="/favorite">Favorite</Link></li>
    </ul>
  </nav>
}

export default NavBar;