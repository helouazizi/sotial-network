CREATE TABLE group_posts (
    id INTEGER PRIMARY KEY,
    group_id INTEGER,
    member_id INTEGER,
    title TEXT NOT NULL, 
    content TEXT NOT NULL,
    media TEXT, 
    created_at DATETIME NOT NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);