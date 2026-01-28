import '../css/Home.css'
import MovieCard from '../components/MovieCard'
import {useState} from 'react'

function Home(){
  const [searchQuery, setSearchQuery] = useState("");//khai báo biến searchQuery và hàm setSearchQuery để cập nhật giá trị

  const movies = [
    {id: 1, title: "Inception", release_date: "2010", url: "https://example.com/inception.jpg" },
    {id: 2, title: "The Dark Knight", release_date: "2008", url: "https://example.com/dark_knight.jpg" },
    {id: 3, title: "Interstellar", release_date: "2014", url: "https://example.com/interstellar.jpg" },
  ]
  function handleSearch(e){
    e.preventDefault();//ngăn chặn hành vi mặc định của form khi submit
    alert(`Searching for: ${searchQuery}`);//hiển thị thông báo tìm kiếm với giá trị của searchQuery
    setSearchQuery("");
  }
  return <div className="home">
    <h1>Welcome to MovieApp</h1>
    <form onSubmit={handleSearch} className="search-form">
      <input type="text" 
      placeholder="Search for movies..." 
      className="search-input" 
      value={searchQuery} // Liên kết giá trị của input với biến searchQuery
      onChange={e => setSearchQuery(e.target.value)}// Cập nhật searchQuery khi người dùng nhập dữ liệu
      />
      <button type="submit" className="search-button">Search</button>
    </form>
    <div className="movies-grid">
      {movies.map(movie => (
       <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  </div>
}

export default Home;
//phút thứ 38