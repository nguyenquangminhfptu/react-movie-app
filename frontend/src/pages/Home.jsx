import '../css/Home.css'
import MovieCard from '../components/MovieCard'
import {useState, useEffect} from 'react'
import { searchMovies, getPopularMovies } from '../services/api';
function Home(){
  const [searchQuery, setSearchQuery] = useState("");//khai báo biến searchQuery và hàm setSearchQuery để cập nhật giá trị
  const [movies, setMovies] = useState([]);//khai báo biến movies để lưu trữ danh sách phim và hàm setMovies để cập nhật giá trị
  const [error, setError] = useState(null);//khai báo biến error để lưu trữ lỗi và hàm setError để cập nhật giá trị
  const [loading, setLoading] = useState(false);//khai báo biến loading để theo dõi trạng thái tải dữ liệu và hàm setLoading để cập nhật giá trị
  useEffect(() => {
    const loadPopularMovies = async () => {//gọi hàm bất đồng bộ để tải danh sách phim phổ biến
      try{
      const popularMovies = await getPopularMovies();//gọi hàm getPopularMovies để lấy danh sách phim phổ biến
      setMovies(popularMovies);//cập nhật biến movies với danh sách phim lấy được
      } catch (error){
        console.error("Error fetching popular movies:", error);//xử lý lỗi nếu có
        setError("Failed to load popular movies. Please try again later.");//cập nhật biến error với thông báo lỗi
      }finally{
        setLoading(false);//đặt trạng thái loading về false sau khi hoàn thành tải dữ liệu
      }
    }
    loadPopularMovies();//gọi hàm loadPopularMovies để thực hiện tải danh sách phim phổ biến
   }
, []);//sử dụng hook useEffect để thực hiện các tác vụ phụ, ở đây là tải danh sách phim phổ biến khi component được gắn vào DOM


  const handleSearch = async (e) => {
    e.preventDefault();//ngăn chặn hành vi mặc định của form khi submit
  
    if(!searchQuery.trim()) return;//nếu searchQuery rỗng hoặc chỉ chứa khoảng trắng thì không thực hiện tìm kiếm
    if(loading) return;//nếu đang trong trạng thái loading thì không thực hiện tìm kiếm
    setLoading (true);
    try{
      const searchResults = await searchMovies(searchQuery);//gọi hàm searchMovies để tìm kiếm phim dựa trên searchQuery
      setMovies(searchResults);//cập nhật biến movies với kết quả tìm kiếm
    }catch (error){
      console.error("Error searching movies:", error);
      setError("Failed to search movies. Please try again later.");
    }finally{
      setLoading(false);
    }
      
    
    setSearchQuery("");
  }


  return <div className="home">
    <form onSubmit={handleSearch} className="search-form">
      <input type="text" 
      placeholder="Search for movies..." 
      className="search-input" 
      value={searchQuery} // Liên kết giá trị của input với biến searchQuery
      onChange={e => setSearchQuery(e.target.value)}// Cập nhật searchQuery khi người dùng nhập dữ liệu
      />
      <button type="submit" className="search-button">Search</button>
    </form>

    {error && <p className="error-message">{error}</p>}
    {loading && <p>Loading movies...</p>}

    <div className="movies-grid">
      {movies.map(movie => (
       <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  </div>
}

export default Home;
//phút thứ 38