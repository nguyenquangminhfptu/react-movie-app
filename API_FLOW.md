# 🎬 Luồng Dữ Liệu API - React Movie App

## 🔄 LUỒNG DỮ LIỆU:

### **Bước 1: Gọi API** (`src/services/api.js` dòng 4-7)
```javascript
export const getPopularMovies = async () => {
  // 1️⃣ Gửi request HTTP GET đến TMDB API
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)
  
  // 2️⃣ Chuyển response thành JSON object
  const data = await response.json()
  
  // 3️⃣ Trả về mảng phim (data.results)
  // Ví dụ: [
  //   {id: 1, title: "Avatar", poster_path: "/abc.jpg", release_date: "2022-12-16"},
  //   {id: 2, title: "Titanic", poster_path: "/xyz.jpg", release_date: "1997-11-18"},
  //   ...
  // ]
  return data.results
}
```

### **Bước 2: Lấy dữ liệu khi component load** (`src/pages/Home.jsx` dòng 10-22)
```javascript
useEffect(() => {
  const loadPopularMovies = async () => {
    try{
      // 4️⃣ Gọi hàm getPopularMovies() - chờ dữ liệu trả về
      const popularMovies = await getPopularMovies();
      
      // 5️⃣ Lưu dữ liệu vào state 'movies'
      // Khi state thay đổi → React tự động render lại component
      setMovies(popularMovies);
    } catch (error){
      setError("Failed to load movies");
    }
  }
  
  // 6️⃣ Thực thi hàm loadPopularMovies
  loadPopularMovies();
}, []); // [] = chỉ chạy 1 lần khi component mount
```

### **Bước 3: Hiển thị dữ liệu** (`src/pages/Home.jsx` dòng 40-44)
```javascript
<div className="movies-grid">
  {/* 7️⃣ Duyệt qua mảng movies và tạo MovieCard cho từng phim */}
  {movies.map(movie => (
    <MovieCard key={movie.id} movie={movie} />
    // Truyền object 'movie' vào component MovieCard qua props
  ))}
</div>
```

### **Bước 4: Nhận và hiển thị props** (`src/components/MovieCard.jsx`)
```javascript
function MovieCard({movie}) { // 8️⃣ Nhận object 'movie' từ props
  
  // 9️⃣ Tạo URL hình ảnh từ poster_path
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return <div className="movie-card">
    {/* 🔟 Hiển thị dữ liệu */}
    <img src={imageUrl} alt={movie.title} />
    <h3>{movie.title}</h3>
    <p>{movie.release_date}</p>
  </div>
}
```

## 📊 TÓM TẮT LUỒNG:
1. **API call** → `fetch()` gửi request đến TMDB
2. **Response** → Chuyển thành JSON 
3. **Return** → Trả về mảng phim `data.results`
4. **useEffect** → Gọi API khi component mount
5. **setState** → Lưu vào `movies` state
6. **Re-render** → React tự động render lại
7. **Map** → Tạo MovieCard cho mỗi phim
8. **Props** → Truyền dữ liệu vào MovieCard
9. **Display** → Hiển thị UI

## 🔑 Cấu trúc dữ liệu từ TMDB API:
```json
{
  "results": [
    {
      "id": 123,
      "title": "Movie Title",
      "poster_path": "/path/to/poster.jpg",
      "release_date": "2024-01-15",
      "overview": "Movie description...",
      "vote_average": 8.5
    }
  ]
}
```

## 🛠️ Các Hook React được sử dụng:
- **useState**: Quản lý state (movies, loading, error)
- **useEffect**: Thực hiện side effects (API calls)
- **map**: Render danh sách components

## 📝 Ghi chú:
- API key được lưu trong file `.env` (không push lên Git)
- Sử dụng `async/await` để xử lý bất đồng bộ
- Error handling với `try/catch`
- Loading state để hiển thị trạng thái tải dữ liệu
