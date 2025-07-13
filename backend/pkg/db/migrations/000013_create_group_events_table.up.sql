CREATE TABLE
    group_events (
        id INTEGER PRIMARY KEY,
        group_id INTEGER,
        member_id INTEGER,
        title TEXT NOT NULL,
        descreption TEXT NOT NULL,
        event_date DATETIME NOT NULL,
        created_at DATETIME NOT NULL,
        total_going INTEGER CHECK (total_going >= 0),
        total_not_going INTEGER CHECK (total_not_going >= 0),
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

CREATE TRIGGER IF NOT EXISTS upsert_vote BEFORE INSERT ON group_events_votes FOR EACH ROW BEGIN
DELETE FROM group_events_votes
WHERE
    event_id = NEW.event_id
    AND member_id = NEW.member_id;

END;

CREATE TRIGGER IF NOT EXISTS update_vote_counts_after_insert AFTER INSERT ON group_events_votes FOR EACH ROW BEGIN
UPDATE group_events
SET
    total_going = (
        SELECT
            COUNT(*)
        FROM
            group_events_votes
        WHERE
            event_id = NEW.event_id
            AND status = 'going'
    ),
    total_not_going = (
        SELECT
            COUNT(*)
        FROM
            group_events_votes
        WHERE
            event_id = NEW.event_id
            AND status = 'not going'
    )
WHERE
    id = NEW.event_id;

END;

CREATE TRIGGER IF NOT EXISTS update_vote_counts_after_delete AFTER DELETE ON group_events_votes FOR EACH ROW BEGIN
UPDATE group_events
SET
    total_going = (
        SELECT
            COUNT(*)
        FROM
            group_events_votes
        WHERE
            event_id = OLD.event_id
            AND status = 'going'
    ),
    total_not_going = (
        SELECT
            COUNT(*)
        FROM
            group_events_votes
        WHERE
            event_id = OLD.event_id
            AND status = 'not going'
    )
WHERE
    id = OLD.event_id;

END;