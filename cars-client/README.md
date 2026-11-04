# Cars Client

Frontend projektu samochodowego przygotowany w React, TypeScript i Vite.
Na tym etapie dane obsługuje lokalny `json-server`; aplikacja nie łączy się
jeszcze z backendem ASP.NET Core.

## Uruchomienie

W folderze `cars-client` zainstaluj zależności, a następnie uruchom dwa terminale:

```sh
npm install
npm run api
```

W drugim terminalu uruchom aplikację:

```sh
npm run dev
```

Vite wyświetli adres aplikacji, zwykle `http://localhost:5173`. API jest dostępne
pod `http://localhost:3000/cars`. Adres API można zmienić przez zmienną
`VITE_CARS_API_URL` (przykład znajduje się w `.env.example`).

## Widoki

- `/` — strona główna,
- `/cars` — lista samochodów z możliwością usunięcia,
- `/cars/new` — formularz dodawania,
- `/cars/:id` — szczegóły samochodu,
- `/cars/:id/edit` — formularz pełnej aktualizacji.

`npm run build` buduje wersję produkcyjną, a `npm run lint` sprawdza kod.
