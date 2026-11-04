import { NavLink, Outlet } from 'react-router';

export default function RootLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <NavLink className="brand" to="/" aria-label="AutoAtlas — strona główna">
            <span className="brand-mark" aria-hidden="true">A</span>
            <span>Auto<span className="brand-accent">Atlas</span></span>
          </NavLink>
          <nav className="main-nav" aria-label="Nawigacja główna">
            <NavLink end to="/">Strona główna</NavLink>
            <NavLink to="/cars">Samochody</NavLink>
            <NavLink className="nav-add" to="/cars/new">+ Dodaj samochód</NavLink>
          </nav>
        </div>
      </header>
      <main className="page-content"><Outlet /></main>
      <footer className="site-footer">
        <span>AutoAtlas</span>
        <span>Cars Client · React + TypeScript</span>
      </footer>
    </div>
  );
}
