# Kühlschrank Dashboard

Ein Next.js 14 Dashboard zur Verwaltung und Anzeige von Kühlschrankinhalten, verbunden mit einer Supabase-Datenbank.

## Features

- **3 KPI-Karten**: Artikel gesamt, bald ablaufend (≤3 Tage), abgelaufen
- **Artikeltabelle**: Alle Einträge mit Name, Kategorie, Menge und Ablaufdatum
- **Farbige Statusanzeige**: Grün (frisch), Gelb (≤3 Tage), Rot (abgelaufen)

## Stack

- [Next.js 14](https://nextjs.org/) mit App Router
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- TypeScript

## Voraussetzungen

- Node.js 18.17 oder neuer
- Ein Supabase-Projekt mit der Tabelle `fridge_items`

## Supabase Tabellen-Schema

Erstelle in deinem Supabase-Projekt folgende Tabelle:

```sql
create table fridge_items (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null,
  quantity    numeric not null,
  unit        text not null,
  expires_at  date not null,
  created_at  timestamp with time zone default now()
);
```

## Setup

1. **Repository klonen**

   ```bash
   git clone <repo-url>
   cd mini-dashboard
   ```

2. **Abhängigkeiten installieren**

   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren**

   Kopiere die Beispieldatei und trage deine Supabase-Zugangsdaten ein:

   ```bash
   cp .env.local.example .env.local
   ```

   Bearbeite `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<dein-projekt>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<dein-anon-key>
   ```

   Die Werte findest du in deinem Supabase-Projekt unter **Settings → API**.

4. **Entwicklungsserver starten**

   ```bash
   npm run dev
   ```

   Öffne [http://localhost:3000](http://localhost:3000) im Browser.

5. **Für Produktion bauen**

   ```bash
   npm run build
   npm run start
   ```

## Projektstruktur

```
mini-dashboard/
├── app/
│   ├── globals.css       # Tailwind-Importe
│   ├── layout.tsx        # Root Layout mit Header
│   └── page.tsx          # Dashboard-Seite (KPIs + Tabelle)
├── lib/
│   └── supabase.ts       # Supabase Client
├── types/
│   └── fridge.ts         # TypeScript-Typen & Status-Logik
├── .env.local.example    # Beispiel-Umgebungsvariablen
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Statusfarben

| Status | Bedingung | Farbe |
|--------|-----------|-------|
| Frisch | Ablaufdatum > 3 Tage in der Zukunft | Grün |
| Bald ablaufend | Ablaufdatum ≤ 3 Tage in der Zukunft | Gelb |
| Abgelaufen | Ablaufdatum in der Vergangenheit | Rot |
