import { NavLink, useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';
import { useCarUiStore } from '../store/useCarUiStore';

export default function Navigation() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const favoriteCarIdsByUser = useCarUiStore((state) => state.favoriteCarIdsByUser);
  const favoriteCount = user ? (favoriteCarIdsByUser[user.id] ?? []).length : 0;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="main-nav" aria-label="Nawigacja główna">
      <NavLink end to="/">Strona główna</NavLink>
      <NavLink to="/about">O aplikacji</NavLink>
      {user ? (
        <>
          <NavLink end to="/cars">Samochody</NavLink>
          <NavLink className="nav-add" to="/cars/new">+ Dodaj samochód</NavLink>
          <span className="favorite-counter" aria-live="polite">Ulubione: {favoriteCount}</span>
          <span className="user-info" title={user.email}>{user.userName} ({user.roles.join(', ')})</span>
          <button className="nav-button" type="button" onClick={handleLogout}>Wyloguj</button>
        </>
      ) : (
        <>
          <NavLink to="/login">Logowanie</NavLink>
          <NavLink to="/register">Rejestracja</NavLink>
        </>
      )}
    </nav>
  );
}
