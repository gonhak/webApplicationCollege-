export default function AboutPage() {
  return (
    <section className="content-section about-page">
      <p className="eyebrow">AutoAtlas</p>
      <h1>O aplikacji</h1>
      <p className="section-intro">AutoAtlas łączy katalog samochodów z kontami użytkowników, uwierzytelnianiem JWT i indywidualnymi ustawieniami interfejsu.</p>
      <div className="about-panel">
        <h2>Twoje konto i Twoje dane</h2>
        <p>Po rejestracji potwierdź adres e-mail. Po zalogowaniu możesz przeglądać i wyszukiwać samochody, a także zapisywać ulubione auta. Każde konto ma własną listę ulubionych.</p>
        <p>Dostęp do danych samochodów wymaga zalogowania. Operacje administracyjne są weryfikowane również przez backend, niezależnie od tego, co pokazuje interfejs.</p>
      </div>
    </section>
  );
}
