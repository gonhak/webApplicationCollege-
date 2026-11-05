import { NavLink, Outlet } from 'react-router';
import Navigation from '../components/Navigation';

export default function RootLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <NavLink className="brand" to="/" aria-label="AutoAtlas — strona główna">
            <span className="brand-mark" aria-hidden="true">A</span>
            <span>Auto<span className="brand-accent">Atlas</span></span>
          </NavLink>
          <Navigation />
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
