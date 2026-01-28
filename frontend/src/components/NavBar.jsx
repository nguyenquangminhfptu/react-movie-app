import '../css/NavBar.css'

function NavBar(){
  return <nav className="navbar">
    <h2 className="navbar-logo">MovieApp</h2>
    <ul className="navbar-links">
      <li><a href="/">Home</a></li>
      <li><a href="/favorite">Favorite</a></li>
    </ul>
  </nav>
}

export default NavBar;