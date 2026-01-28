import { createContext, useState, useEffect } from "react";

// 1️⃣ Tạo Context để chia sẻ dữ liệu
export const MovieContext = createContext();

// 2️⃣ Provider component bao bọc toàn bộ app
export const MovieProvider = ({ children }) => {
  // 3️⃣ State lưu danh sách phim yêu thích
  const [favorites, setFavorites] = useState([]);

  // 4️⃣ Load favorites từ localStorage khi app khởi động
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // 5️⃣ Lưu vào localStorage mỗi khi favorites thay đổi
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // 6️⃣ Thêm phim vào favorites
  const addToFavorites = (movie) => {
    setFavorites(prev => [...prev, movie]);
  };

  // 7️⃣ Xóa phim khỏi favorites
  const removeFromFavorites = (movieId) => {
    setFavorites(prev => prev.filter(movie => movie.id !== movieId));
  };

  // 8️⃣ Kiểm tra phim có trong favorites không
  const isFavorite = (movieId) => {
    return favorites.some(movie => movie.id === movieId);
  };

  // 9️⃣ Cung cấp data & functions cho toàn bộ app
  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
}