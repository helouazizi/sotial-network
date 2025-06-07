CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
    nickname TEXT UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
    -- date_of_birth DATETIME NOT NULL,
    -- is_private INTEGER DEFAULT 0,
    -- last_name TEXT NOT NULL,
    -- first_name TEXT NOT NULL,
    -- about_me TEXT,
    -- avatar TEXT NOT NULL,
    -- created_at DATETIME NOT NULL,
    -- updated_at DATETIME NOT NULL
);
