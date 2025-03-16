# Note Taking Application - Database Configuration

This project uses **PostgreSQL** as the relational database, hosted on **Azure**, and connected locally using **DBeaver**. The database consists of two tables: `users` and `notes`.

## Database Tables

### Users Table

- `id` (Primary Key, Auto-filled)  
- `username` (Unique, Required)  
- `email` (Unique, Required)  
- `phone` (Unique, Required)  
- `password` (Required)  
- `created_at` (Auto-filled Timestamp)  

### Notes Table

- `id` (Primary Key, Auto-filled)  
- `user_id` (Foreign Key from `users.id`, Cascade on Delete)  
- `title` (Required)  
- `content` (Required)  
- `created_at` (Auto-filled Timestamp)  
- `updated_at` (Auto-filled Timestamp)  

---

## Database Setup

### - Create the Database

Connect to PostgreSQL and run:

```sql
CREATE DATABASE note_app;
```

### - Create Tables

Run the following SQL queries to create tables:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(15) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(10) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

```sql
CREATE TABLE notes ( 
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Database Configuration in Node.js

The `db.js` file inside the `/database` folder handles PostgreSQL connections with the credientials provided:

```js
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,  // Allows connection to Azure without a certificate.
  }
});
```

---

## Environment Variables (`.env`)

Create a `.env` file inside `/database` and add:

```
DB_USER=your_username
DB_HOST=your_azure_host
DB_NAME=note_app
DB_PASSWORD=your_password
DB_PORT=5432 (Default PORT for PostgreSQL)
```

---

## Connecting Locally via DBeaver

1. Open **DBeaver** and create a new PostgreSQL connection.  
2. Enter your **Azure PostgreSQL credentials** (`host, database, user, password`, `port`).  
3. Click **Test Connection** to verify the connection.  
4. Execute the provided SQL queries to create tables.  

---

## Testing the Connection

Run:

```sh
node database/db.js
```

If everything is set up correctly, you should see:

```
Connected to PostgreSQL
```