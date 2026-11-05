# Cars Client

Frontend projektu samochodowego przygotowany w React, TypeScript i Vite.
Aktualny etap łączy go z backendem ASP.NET Core przez Axios. Wyszukiwanie,
filtr ulubionych i identyfikatory ulubionych samochodów są obsługiwane przez Zustand.

## Uruchomienie

1. Uruchom profil HTTPS projektu `Cars.API` w Visual Studio.
2. W folderze `cars-client` zainstaluj zależności (`npm install`).
3. Uruchom frontend (`npm run dev`).
4. Otwórz adres Vite, domyślnie `http://localhost:5173`.

Adres API jest ustawiony w `.env.development` na `https://localhost:7080/api`,
zgodnie z profilem HTTPS w `Cars.API/Properties/launchSettings.json`. Jeżeli
Visual Studio pokaże inny port, zaktualizuj `VITE_API_URL` i uruchom ponownie Vite.
Backend dopuszcza origin Vite `http://localhost:5173` w konfiguracji CORS.

## Funkcje

- `/` — strona główna,
- `/cars` — lista z wyszukiwaniem i filtrem ulubionych,
- `/cars/new` — formularz dodawania,
- `/cars/:id` — szczegóły i przełącznik ulubionych,
- `/cars/:id/edit` — formularz pełnej aktualizacji,
- pozostałe adresy — widok 404.

`npm run build` buduje wersję produkcyjną, a `npm run lint` sprawdza kod.

Starszy plik `db.json`, skrypt `npm run api` i zależność json-server pozostają
w repozytorium, ale obecny frontend pobiera dane z `Cars.API`.
