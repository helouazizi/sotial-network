CREATE TABLE group_events (
    id INTEGER PRIMARY KEY,
    group_id INTEGER,
    member_id INTEGER,
    title TEXT NOT NULL, 
    descreption TEXT NOT NULL,
    event_date DATETIME NOT NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE group_events_votes (
    id INTEGER PRIMARY KEY,
    event_id INTEGER,
    member_id INTEGER,
    status TEXT CHECK (status IN ('going', 'not going')),
    FOREIGN KEY (event_id) REFERENCES group_events(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
); 