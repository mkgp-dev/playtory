# playtory
A simple Inventory Application project submitted for The Odin Project course.



### Built With

- **Node.js**
- **TypeScript**
- **Express**
- **EJS** + **express-ejs-layouts**
- **PostgreSQL**
- **Tailwind CSS**
- **daisyUI**
- **dotenv**
- **nodemon**
- **ts-node**



### SQL
```sql
CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
```sql
CREATE TABLE developers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) UNIQUE NOT NULL,
  website TEXT,
  country VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
```sql
CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  genre_id INTEGER NOT NULL REFERENCES genres(id) ON DELETE RESTRICT,
  developer_id INTEGER REFERENCES developers(id) ON DELETE SET NULL,
  platform VARCHAR(100) NOT NULL,
  release_year INTEGER CHECK (
    release_year >= 1970
    AND release_year <= EXTRACT(YEAR FROM NOW())::INT + 1
  ),
  status VARCHAR(30) NOT NULL DEFAULT 'owned',
  price_paid NUMERIC(10,2) CHECK (price_paid >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
