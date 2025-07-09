CREATE TABLE group_comments (
    id INTEGER PRIMARY KEY,
    group_post_id INTEGER,
    member_id INTEGER,
    content TEXT NOT NULL,
    media TEXT, 
    created_at DATETIME NOT NULL,
    FOREIGN KEY (group_post_id) REFERENCES group_posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);