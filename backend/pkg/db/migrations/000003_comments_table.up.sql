CREATE TABLE comments(
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE
);


DROP TRIGGER IF EXISTS increment_total_comments;

CREATE TRIGGER increment_total_comments
AFTER INSERT ON comments
BEGIN
  UPDATE posts
  SET comments = comments + 1
  WHERE id = NEW.post_id;
END;