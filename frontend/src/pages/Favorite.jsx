import '../css/Favorite.css'
import { useContext } from 'react';
import { MovieContext } from '../contexts/MovieContext';
import MovieCard from '../components/MovieCard';

function Favorite(){
  // 1️⃣2️⃣ Lấy danh sách favorites từ Context
  const { favorites } = useContext(MovieContext);

  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <h2>No Favorite Movies Yet</h2>
        <p>Start adding movies to your favorites!</p>
      </div>
    );
  }

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

export default Favorite;