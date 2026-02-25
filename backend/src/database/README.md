# Database Structure

Folder ini dipakai untuk menjaga skema database tetap rapi dan mudah di-scale.

## Struktur

- `migrations/`: SQL perubahan schema (create/alter/drop table).
- `seeds/`: SQL data awal atau dummy untuk development.

## Saran Naming

- Migration: `YYYYMMDD_HHMM_<deskripsi>.sql`
- Seed: `YYYYMMDD_HHMM_<deskripsi>.sql`

## Catatan

- Saat ini backend auto-create tabel `users` dari kode di `src/config/mysql.ts`.
- Schema `products` dikelola dari folder migration supaya tidak duplikat definisi.
- Untuk perubahan schema berikutnya, simpan SQL baru ke `migrations/` supaya histori perubahan jelas.
