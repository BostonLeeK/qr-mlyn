# MLYN — Каталог арт-проєктів

Каталог з сторінками арт-проєктів для перегляду по QR-коду. Next.js, Tailwind, TypeScript, Neon Postgres, Vercel Blob.

## Структура

- `/` — головна (список проєктів)
- `/p/[slug]` — сторінка проєкту (фото, назва, автор, опис, вартість)
- `/admin` — вхід в адмінку
- `/admin/dashboard` — управління проєктами
- `/admin/projects/new` — новий проєкт
- `/admin/projects/[id]` — редагування

## Налаштування

1. Створи `.env.local` на основі `.env.example`

2. **База даних (Neon)**  
   Додай `DATABASE_URL` з Vercel Marketplace → Neon Postgres.

3. **Авторизація**  
   `ADMIN_USER` та `ADMIN_PASSWORD` — логін/пароль для адмінки.

4. **Blob (Vercel)**  
   Додай `BLOB_READ_WRITE_TOKEN` для завантаження фото.

5. **Ініціалізація БД**  
   Таблиця створюється при першому відкритті головної. Або виклик `POST /api/init-db`.

## Запуск

```bash
npm install
npm run dev
```

## Деплой на Vercel

1. Підключи Neon Postgres та Blob через Vercel Marketplace
2. Задай змінні: `DATABASE_URL`, `ADMIN_USER`, `ADMIN_PASSWORD`, `BLOB_READ_WRITE_TOKEN`
3. Deploy

QR-код веде на головну сторінку каталогу.
