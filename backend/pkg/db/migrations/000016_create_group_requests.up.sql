CREATE TABLE group_requests (
    id INTEGER PRIMARY KEY,
    group_id INTEGER,
    requested_id INTEGER,
    sender_id INTEGER,
    type TEXT CHECK(type IN ('invitation', 'demand')),
    FOREIGN KEY (requested_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE ON UPDATE CASCADE
);