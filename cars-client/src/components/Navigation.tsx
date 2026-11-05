import { NavLink } from 'react-router';
import { useCarUiStore } from '../store/useCarUiStore';

export default function Navigation() {
  const favoriteCount = useCarUiStore((state) => state.favoriteCarIds.length);

  return (
    <nav className="main-nav" aria-label="Nawigacja główna">
      <NavLink end to="/">Strona główna</NavLink>
      <NavLink to="/cars">Samochody</NavLink>
      <NavLink className="nav-add" to="/cars/new">+ Dodaj samochód</NavLink>
      <span className="favorite-counter" aria-live="polite">Ulubione: {favoriteCount}</span>
    </nav>
  );
}
