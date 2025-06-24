CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
    last_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    nickname TEXT ,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    date_of_birth DATETIME NOT NULL,
    is_private INTEGER DEFAULT 0, 
    about_me TEXT,
    avatar TEXT,
    token TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);