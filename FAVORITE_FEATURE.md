# 🎬 Feature Favorite - Chi tiết Logic & Cách hoạt động

## 📚 MỤC LỤC
1. [Context API - Quản lý State Global](#context-api)
2. [localStorage - Lưu trữ dữ liệu](#localstorage)
3. [MovieContext - Trung tâm quản lý](#moviecontext)
4. [Integration - Tích hợp vào Components](#integration)
5. [Luồng dữ liệu hoàn chỉnh](#data-flow)

---

## 🌐 CONTEXT API - Quản lý State Global {#context-api}

### **Vấn đề cần giải quyết:**
- Danh sách phim yêu thích cần được chia sẻ giữa nhiều components:
  - `MovieCard` (thêm/xóa favorite)
  - `Favorite` page (hiển thị danh sách)
- Truyền props qua nhiều cấp rất phức tạp (**props drilling**)

### **Giải pháp: Context API**
```javascript
// Tạo Context - "kho dữ liệu chung"
export const MovieContext = createContext();

// Provider - "người phân phối" dữ liệu
export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  
  return (
    <MovieContext.Provider value={/* data & functions */}>
      {children}
    </MovieContext.Provider>
  );
};
```

**Cách hoạt động:**
1. `MovieProvider` bọc toàn bộ app trong `main.jsx`
2. Bất kỳ component con nào cũng có thể truy cập dữ liệu bằng `useContext(MovieContext)`
3. Khi state thay đổi → Tất cả components sử dụng Context đều tự động re-render

---

## 💾 localStorage - Lưu trữ dữ liệu {#localstorage}

### **Tại sao cần localStorage?**
- State trong React là **temporary** (tạm thời)
- Khi refresh trang → state bị reset về giá trị ban đầu
- localStorage lưu trữ dữ liệu **vĩnh viễn** trên trình duyệt

### **Cách sử dụng:**

#### **1. Lưu dữ liệu vào localStorage**
```javascript
useEffect(() => {
  // Chuyển array thành JSON string và lưu vào localStorage
  localStorage.setItem("favorites", JSON.stringify(favorites));
}, [favorites]); // Chạy mỗi khi favorites thay đổi
```

#### **2. Đọc dữ liệu từ localStorage**
```javascript
useEffect(() => {
  const storedFavorites = localStorage.getItem("favorites");
  if (storedFavorites) {
    // Chuyển JSON string thành array và set vào state
    setFavorites(JSON.parse(storedFavorites));
  }
}, []); // Chỉ chạy 1 lần khi component mount
```

**Lưu ý:**
- localStorage chỉ lưu được **string**
- Phải dùng `JSON.stringify()` để chuyển object/array → string
- Phải dùng `JSON.parse()` để chuyển string → object/array

---

## 🎯 MovieContext - Trung tâm quản lý {#moviecontext}

### **File: `src/contexts/MovieContext.jsx`**

```javascript
import { createContext, useState, useEffect } from "react";

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  // 📦 STATE: Lưu danh sách phim yêu thích
  const [favorites, setFavorites] = useState([]);

  // 🔄 LOAD: Đọc từ localStorage khi app khởi động
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // 💾 SAVE: Lưu vào localStorage mỗi khi favorites thay đổi
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // ➕ FUNCTION: Thêm phim vào favorites
  const addToFavorites = (movie) => {
    setFavorites(prev => [...prev, movie]);
    // Giải thích: 
    // - prev: giá trị hiện tại của favorites
    // - [...prev, movie]: tạo array mới = copy prev + thêm movie
  };

  // ➖ FUNCTION: Xóa phim khỏi favorites
  const removeFromFavorites = (movieId) => {
    setFavorites(prev => prev.filter(movie => movie.id !== movieId));
    // Giải thích:
    // - filter: tạo array mới chỉ chứa các phim có id !== movieId
    // - Kết quả: array không còn phim có id = movieId
  };

  // ✅ FUNCTION: Kiểm tra phim có trong favorites không
  const isFavorite = (movieId) => {
    return favorites.some(movie => movie.id === movieId);
    // Giải thích:
    // - some: return true nếu tìm thấy ít nhất 1 phim có id = movieId
    // - return false nếu không tìm thấy
  };

  // 🎁 VALUE: Dữ liệu & functions được chia sẻ cho toàn bộ app
  const value = {
    favorites,              // Array chứa danh sách phim yêu thích
    addToFavorites,         // Function thêm phim
    removeFromFavorites,    // Function xóa phim
    isFavorite              // Function kiểm tra phim
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};
```

---

## 🔗 Integration - Tích hợp vào Components {#integration}

### **BƯỚC 1: Wrap App với MovieProvider**

**File: `src/main.jsx`**
```javascript
import { MovieProvider } from './contexts/MovieContext.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MovieProvider>  {/* Bọc toàn bộ app */}
        <App />
      </MovieProvider>
    </BrowserRouter>
  </StrictMode>,
)
```

**Tại sao phải wrap?**
- Tất cả components bên trong `<MovieProvider>` mới truy cập được Context
- `<BrowserRouter>` phải ở ngoài cùng để routing hoạt động

---

### **BƯỚC 2: Sử dụng Context trong MovieCard**

**File: `src/components/MovieCard.jsx`**
```javascript
import { useContext } from 'react';
import { MovieContext } from '../contexts/MovieContext';

function MovieCard({movie}){
  // 🎣 LẤY DỮ LIỆU & FUNCTIONS TỪ CONTEXT
  const { addToFavorites, removeFromFavorites, isFavorite } = useContext(MovieContext);
  
  // ✅ KIỂM TRA PHIM CÓ TRONG FAVORITES KHÔNG
  const favorite = isFavorite(movie.id);
  // → true: phim đã favorite
  // → false: phim chưa favorite

  // 🎯 XỬ LÝ KHI CLICK NÚT FAVORITE
  const onFavoriteClick = (e) => {
    e.preventDefault(); // Ngăn các hành động mặc định
    
    if (favorite) {
      // Nếu đã favorite → XÓA khỏi favorites
      removeFromFavorites(movie.id);
    } else {
      // Nếu chưa favorite → THÊM vào favorites
      addToFavorites(movie);
    }
  };

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img src={imageUrl} alt={movie.title} />
        <div className="movie-overlay">
          <button 
            className={`favorite-btn ${favorite ? 'active' : ''}`}
            onClick={onFavoriteClick}
          >
            ♥
          </button>
        </div>
      </div>
      {/* ... */}
    </div>
  );
}
```

**Giải thích CSS class:**
```javascript
className={`favorite-btn ${favorite ? 'active' : ''}`}
```
- Nếu `favorite = true` → class = "favorite-btn active" (màu đỏ)
- Nếu `favorite = false` → class = "favorite-btn" (màu trắng)

---

### **BƯỚC 3: Hiển thị danh sách Favorites**

**File: `src/pages/Favorite.jsx`**
```javascript
import { useContext } from 'react';
import { MovieContext } from '../contexts/MovieContext';
import MovieCard from '../components/MovieCard';

function Favorite(){
  // 🎣 LẤY DANH SÁCH FAVORITES TỪ CONTEXT
  const { favorites } = useContext(MovieContext);

  // 🚫 TRƯỜNG HỢP RỖNG: Chưa có phim yêu thích
  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <h2>No Favorite Movies Yet</h2>
        <p>Start adding movies to your favorites!</p>
      </div>
    );
  }

  // ✅ HIỂN THỊ DANH SÁCH PHIM YÊU THÍCH
  return (
    <div className="favorites">
      <h2>Your Favorite Movies</h2>
      <div className="movies-grid">
        {favorites.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
```

---

### **BƯỚC 4: Navigation với React Router**

**File: `src/components/NavBar.jsx`**
```javascript
import { Link } from 'react-router-dom'

function NavBar(){
  return (
    <nav className="navbar">
      <h2 className="navbar-logo">MovieApp</h2>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/favorite">Favorite</Link></li>
      </ul>
    </nav>
  );
}
```

**❌ SAI:** Dùng `<a href>`
```javascript
<a href="/favorite">Favorite</a>
```
→ Reload toàn bộ trang → Mất state → Mất favorites

**✅ ĐÚNG:** Dùng `<Link to>`
```javascript
<Link to="/favorite">Favorite</Link>
```
→ Chỉ thay đổi route → Giữ nguyên state → Giữ favorites

---

## 🔄 Luồng dữ liệu hoàn chỉnh {#data-flow}

### **KỊCH BẢN: Thêm phim vào Favorites**

```
1. USER CLICK NÚT ♥
   ↓
2. onFavoriteClick() được gọi
   ↓
3. Kiểm tra: favorite === false (chưa có trong favorites)
   ↓
4. Gọi addToFavorites(movie)
   ↓
5. setFavorites([...prev, movie]) → Cập nhật state
   ↓
6. useEffect chạy → Lưu vào localStorage
   ↓
7. React re-render tất cả components sử dụng MovieContext
   ↓
8. MovieCard hiển thị nút ♥ đỏ (class "active")
```

### **KỊCH BẢN: Xem danh sách Favorites**

```
1. USER CLICK "Favorite" TRÊN NAVBAR
   ↓
2. <Link to="/favorite"> thay đổi route (KHÔNG reload)
   ↓
3. React Router render component <Favorite />
   ↓
4. Favorite.jsx gọi useContext(MovieContext)
   ↓
5. Lấy array favorites từ Context
   ↓
6. favorites.map() tạo MovieCard cho mỗi phim
   ↓
7. Hiển thị danh sách phim yêu thích
```

### **KỊCH BẢN: Refresh trang**

```
1. USER REFRESH TRANG (F5)
   ↓
2. React app khởi động lại
   ↓
3. MovieProvider mount → useEffect chạy
   ↓
4. Đọc dữ liệu từ localStorage.getItem("favorites")
   ↓
5. JSON.parse() chuyển string → array
   ↓
6. setFavorites(array) → Khôi phục state
   ↓
7. Tất cả favorites được giữ nguyên!
```

---

## 📊 Sơ đồ kiến trúc

```
┌─────────────────────────────────────────────────┐
│                   main.jsx                       │
│   <BrowserRouter>                                │
│     <MovieProvider> ← Quản lý state global      │
│       <App />                                    │
│     </MovieProvider>                             │
│   </BrowserRouter>                               │
└─────────────────────────────────────────────────┘
                        │
        ┌───────────────┴────────────────┐
        │                                │
┌───────▼────────┐              ┌───────▼────────┐
│   Home.jsx     │              │  Favorite.jsx  │
│                │              │                │
│  - Search      │              │  - Display     │
│  - MovieCard   │              │    favorites   │
│    grid        │              │    list        │
└───────┬────────┘              └───────┬────────┘
        │                                │
        │                                │
        └────────────┬───────────────────┘
                     │
             ┌───────▼────────┐
             │ MovieCard.jsx  │
             │                │
             │ useContext()   │
             │  - isFavorite  │
             │  - add/remove  │
             └───────┬────────┘
                     │
        ┌────────────▼────────────┐
        │   MovieContext.jsx      │
        │                         │
        │  STATE: favorites []    │
        │  FUNCS: add/remove      │
        │  STORAGE: localStorage  │
        └─────────────────────────┘
```

---

## 🎓 Kiến thức quan trọng

### **1. Context API**
- Chia sẻ state giữa nhiều components
- Tránh props drilling
- Re-render tự động khi state thay đổi

### **2. localStorage**
- Lưu trữ vĩnh viễn trên browser
- Chỉ lưu được string (dùng JSON.stringify/parse)
- Dung lượng: ~5-10MB

### **3. React Router**
- `<Link>`: Navigation không reload
- `<a>`: Reload toàn bộ trang
- Giữ state khi chuyển trang

### **4. Array methods**
- `map()`: Tạo array mới từ array cũ
- `filter()`: Lọc phần tử thỏa điều kiện
- `some()`: Kiểm tra có ít nhất 1 phần tử thỏa điều kiện
- `[...prev, new]`: Spread operator - thêm phần tử mới

### **5. useEffect**
- Chạy side effects (API calls, localStorage)
- Dependency array `[]` → chỉ chạy 1 lần
- Dependency array `[favorites]` → chạy khi favorites thay đổi

---

## ✅ Checklist hoàn thành Feature

- [x] Tạo MovieContext với state management
- [x] Implement localStorage để lưu trữ
- [x] Tích hợp Context vào MovieCard
- [x] Thêm nút favorite với toggle function
- [x] Tạo trang Favorite để hiển thị danh sách
- [x] Sử dụng Link thay vì <a> cho navigation
- [x] CSS styling cho active/inactive states
- [x] Xử lý empty state khi chưa có favorites

---

## 🐛 Những lỗi thường gặp

### **1. Mất dữ liệu khi refresh**
**Nguyên nhân:** Không lưu vào localStorage  
**Giải pháp:** Thêm useEffect để sync với localStorage

### **2. Không hiển thị favorites**
**Nguyên nhân:** Dùng `<a href>` thay vì `<Link to>`  
**Giải pháp:** Import và sử dụng Link từ react-router-dom

### **3. Context undefined**
**Nguyên nhân:** Chưa wrap component với Provider  
**Giải pháp:** Đảm bảo `<MovieProvider>` bọc toàn bộ app

### **4. Nút favorite không đổi màu**
**Nguyên nhân:** CSS class "active" không được apply  
**Giải pháp:** Kiểm tra logic `${favorite ? 'active' : ''}`

---

## 🚀 Cải tiến có thể thêm

1. **Loading state** khi thêm/xóa favorites
2. **Animation** khi phim được thêm/xóa
3. **Toast notification** thông báo thành công
4. **Sort/filter** trong trang favorites
5. **Share favorites** qua URL hoặc social media
6. **Sync favorites** với backend server

---

**Tác giả:** GitHub Copilot  
**Ngày tạo:** 28/01/2026  
**Version:** 1.0
