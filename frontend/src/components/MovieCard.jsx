import '../css/MovieCard.css'
import { useContext } from 'react';
import { MovieContext } from '../contexts/MovieContext';

function MovieCard({movie}){
  // 🔟 Lấy functions từ Context
  const { addToFavorites, removeFromFavorites, isFavorite } = useContext(MovieContext);
  
  const favorite = isFavorite(movie.id);

  const imageUrl = movie.poster_path 
  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
  : 'https://via.placeholder.com/500x750?text=No+Image';

  // 1️⃣1️⃣ Toggle favorite
  const onFavoriteClick = (e) => {
    e.preventDefault();
    if (favorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return <div className="movie-card">
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
    <div className="movie-info">
      <h3>{movie.title}</h3>
      <p>{movie.release_date?.split('-')[0]}</p>
    </div>
  </div>
}

export default MovieCard;