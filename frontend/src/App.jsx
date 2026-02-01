import './css/App.css'
import Home from './pages/Home'
import Favorite from './pages/Favorite'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'

function App() {
  return (
    <div>
      <NavBar/>
    
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorite" element={<Favorite />} />
      </Routes>
    </main>
    </div>
  );
}




// function Text({ display }) {

//   return (
//     <div>
//       <h2>{display}</h2>
//     </div>
//   )
// }
export default App


