CREATE TABLE followers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    followed_id INTEGER NOT NULL,
    follower_id INTEGER NOT NULL,
    followed_at DATETIME NOT NULL,
    status TEXT  CHECK (status IN ('accepted', 'pending')),
    FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
)