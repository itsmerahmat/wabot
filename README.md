# wabot

To install dependencies:

```bash
bun install
```

## Run

Project ini memakai Bun untuk install dependency, tapi runtime yang direkomendasikan adalah Node.js (via `tsx`) untuk stabilitas Baileys.

To run (auto reload with nodemon):

```bash
bun run dev
```

To run once:

```bash
bun run start
```

## Gemini (Google GenAI)

- Buat file `.env` (lihat `.env.example`) dan isi `GEMINI_API_KEY`.
- (Opsional) set `GEMINI_MODEL` untuk ganti model.
- Di WhatsApp, kirim pesan: `!ai <pertanyaan>` untuk mendapat jawaban dari Gemini.

## Environment

- `GEMINI_API_KEY` (wajib) — API key dari Google AI Studio.
- `GEMINI_MODEL` (opsional) — default: `gemini-2.5-flash`.
- `LOG_LEVEL` (opsional) — default: `info`.
- `SQLITE_DB_PATH` (opsional) — default: `./data.sqlite`.

## SQLite + Drizzle (Todo)

- Generate migration (kalau schema berubah):

```bash
bun run db:generate
```

- Apply migration ke database:

```bash
bun run db:migrate
```

### Todo commands

- `!todo add <text>`
- `!todo list`
- `!todo done <id>`
- `!todo delete <id>`

This project was created using `bun init` in bun v1.1.10. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
