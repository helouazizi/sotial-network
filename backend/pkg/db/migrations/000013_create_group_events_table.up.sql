CREATE TABLE
    group_events (
        id INTEGER PRIMARY KEY,
        group_id INTEGER,
        member_id INTEGER,
        title TEXT NOT NULL,
        descreption TEXT NOT NULL,
        event_date DATETIME NOT NULL,
        created_at DATETIME NOT NULL,
        FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (member_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    group_events_votes (
        id INTEGER PRIMARY KEY,
        event_id INTEGER,
        member_id INTEGER,
        status TEXT CHECK (status IN ('going', 'not going')),
        FOREIGN KEY (event_id) REFERENCES group_events (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (member_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

-- CREATE TRIGGER log_event_vote AFTER INSERT ON group_events_votes FOR EACH ROW BEGIN
-- INSERT INTO
--     group_events_votes_log (event_id, member_id, status)
-- VALUES
--     (NEW.event_id, NEW.member_id, NEW.status);

-- END;

-- CREATE TABLE IF NOT EXISTS group_event_stats (
--     event_id INTEGER PRIMARY KEY,
--     going_count INTEGER DEFAULT 0,
--     not_going_count INTEGER DEFAULT 0
-- );
-- CREATE TRIGGER update_event_vote_stats
-- AFTER INSERT ON group_events_votes
-- FOR EACH ROW
-- BEGIN
--   INSERT INTO group_event_stats (event_id, going_count, not_going_count)
--   VALUES (NEW.event_id,
--           CASE WHEN NEW.status = 'going' THEN 1 ELSE 0 END,
--           CASE WHEN NEW.status = 'not going' THEN 1 ELSE 0 END)
--   ON CONFLICT(event_id) DO UPDATE SET
--     going_count = going_count + CASE WHEN NEW.status = 'going' THEN 1 ELSE 0 END,
--     not_going_count = not_going_count + CASE WHEN NEW.status = 'not going' THEN 1 ELSE 0 END;
-- END;