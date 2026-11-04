import { Link } from 'react-router';

export default function HomePage() {
  return (
    <section className="home-hero">
      <div className="hero-copy">
        <p className="eyebrow">Twoja kolekcja, w jednym miejscu</p>
        <h1>Samochody, które <span>warto znać.</span></h1>
        <p className="hero-description">
          Przeglądaj swoją kolekcję, poznawaj szczegóły i zarządzaj danymi aut w prostym katalogu.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" to="/cars">Zobacz samochody <span aria-hidden="true">→</span></Link>
          <Link className="button button-quiet" to="/cars/new">Dodaj nowe auto</Link>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="art-sun" />
        <div className="art-road" />
        <svg className="hero-car" viewBox="0 0 620 260" role="presentation">
          <path d="M74 168c12-31 32-48 68-57l78-20 55-52c12-12 27-18 45-18h89c22 0 41 10 55 28l48 61 48 17c19 7 31 23 31 43v27H55v-12c0-8 7-15 19-17Z" fill="#183b36" />
          <path d="m239 96 49-46c9-8 20-13 34-13h86c15 0 27 7 37 20l33 43H239Z" fill="#b8d7c9" />
          <path d="M357 38v61m-112 0h238" stroke="#183b36" strokeWidth="8" />
          <path d="M71 169h516" stroke="#f3b34b" strokeWidth="8" strokeLinecap="round" />
          <circle cx="176" cy="185" r="39" fill="#f6f1e8" /><circle cx="176" cy="185" r="20" fill="#183b36" />
          <circle cx="492" cy="185" r="39" fill="#f6f1e8" /><circle cx="492" cy="185" r="20" fill="#183b36" />
          <path d="M530 133h31c13 0 23 9 25 21l2 9h-50l-8-30Z" fill="#f3b34b" />
        </svg>
        <div className="hero-note"><span>01</span><span>Twoje auta<br />w zasięgu ręki</span></div>
      </div>
      <div className="hero-bottom"><span>01 — KATALOG AUT</span><span>Prosto. Przejrzyście. Po Twojemu.</span></div>
    </section>
  );
}
